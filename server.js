// @ts-check

"use strict";

import path from "path";
import { fileURLToPath } from "url";

import { addUsersToDataBase } from "./src/modules/add-users-to-data-base.js";
import { spawn } from "node:child_process";

import { getUsers } from "./src/api/get-users.js";

import { save } from "./src/modules/save.js";
import { formatMilliseconds } from "./src/utils/time.js";
import { getModels } from "./src/api/get-models.js";
import { chunkArray } from "./src/utils/split-to-chunks.js";
import { proxyIs } from "./src/modules/proxy-is.js";
import { PROXY } from "./src/const/proxy.js";

import { META } from "./src/const/test-data.js";

import EventEmitter from "node:events";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userParserEvent = new EventEmitter();

const TEST = true;

const MAX_LENGTH = TEST ? 20 : Infinity;

let start = 0;
let end = 0;

let workersCounter = 0;

/** @type {Set<string>} */
const globalModelsIds = new Set();

/** @type {Set<string>} */
const globalUsersHandles = new Set();

/** @type {Array<string>} */
const globalUsersMeta = [];

/** @type {Array<string>} */
const globalUsersMetaCache = [];

/** @type {Array<string>} */
const globalProxyMeta = [];

/** @type {Array<string>} */
const globalProxyRotten = [];

/**
 * @param {string[]} proxyList
 * @returns {Promise<void>}
 */
const initProxy = async (proxyList) => {
  for (const meta of proxyList) {
    const res = await proxyIs(meta);

    console.log(res);

    if (res) {
      globalProxyMeta.push(meta);
    } else {
      globalProxyRotten.push(meta);
    }
  }
};

/**
 * @param {number} page
 * @returns
 */
const models = async (page) => {
  const modelsResponse = await getModels(page);

  if (modelsResponse) {
    for (const model of modelsResponse.creators) {
      if (model.guid) {
        console.log("MODEL_ID_ADD", model.guid);

        globalModelsIds.add(model.guid);
      }
    }
  }

  const filter = TEST ? 1 : !modelsResponse || modelsResponse.totalPages;

  if (filter === page) {
    console.log("MODELS_ID_READY", globalModelsIds.size);

    return;
  }

  page++;

  await models(page);
};

/**
 * @param {string} modalId
 * @param {string | undefined} next
 */
const users = async (modalId, next) => {
  const usersResponse = await getUsers(modalId, next);

  if (usersResponse?.success?.users) {
    usersResponse.success.users.forEach((user) => {
      if (user.handle) {
        console.log("USER_HANDLE", user.handle);

        globalUsersHandles.add(user.handle);
      }
    });
  }

  if (globalUsersHandles.size >= MAX_LENGTH) {
    return;
  }

  if (usersResponse?.success?.next) {
    await users(modalId, usersResponse.success.next);
  }
};

/**
 * @param {string} userMeta
 * @param {string} proxy
 * @returns {void}
 */
const worker = (userMeta, proxy) => {
  const childProcess = spawn("node", ["parser.js", `${userMeta}`, `${proxy}`]);

  childProcess.stdout.on("data", (data) => {
    const user = data.toString();

    console.log("USER_META", user);

    globalUsersMeta.push(user);
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`[PARENT] stderr from child: ${data}`);

    userParserEvent.emit("parser", proxy);
  });

  childProcess.on("close", (code) => {
    userParserEvent.emit("parser", proxy);
  });

  childProcess.on("error", (err) => {
    userParserEvent.emit("parser", proxy);
  });
};

/**
 * @returns {void}
 */
const finallyAction = () => {
  end = Date.now();

  const info = {
    all: globalUsersHandles.size,
    active: globalUsersMeta.length,
    time: formatMilliseconds(end - start),
  };

  save(
    `${JSON.stringify(globalUsersMeta)}ParsInfo:${JSON.stringify(info)}`,
    path.join(__dirname, "output/users.txt")
  );

  // addUsersToDataBase("All_USERS_PARSER", globalUsersMeta).then(() => {
  //   console.log("Data is saved to data base");

  //   process.exit(0);
  // });
  Promise.resolve().then(() => {
    process.exit(0);
  });
};

/**
 * @returns {string}
 */
const getUsersMeta = () => {
  const meta = globalUsersMetaCache[0];

  globalUsersMetaCache.splice(0, 1);

  console.log(globalUsersMetaCache.length);

  return meta;
};

/**
 * @returns {Promise<void>}
 */
const usersPars = async () => {
  await initProxy(PROXY);

  save(
    `proxyMeta${JSON.stringify(globalProxyMeta)}length:${
      globalProxyMeta.length
    }/proxyRotten${JSON.stringify(globalProxyRotten)}length:${
      globalProxyRotten.length
    }`,
    path.join(__dirname, "output/proxy.txt")
  );

  start = Date.now();

  await models(0);

  const chunksModelsId = chunkArray(Array.from(globalModelsIds.values()), 100);

  for (const modelsId of chunksModelsId) {
    await /** @type {Promise<void>} */ (
      new Promise((resolve) => {
        let index = 0;

        for (const modelId of modelsId) {
          users(modelId, undefined).finally(() => {
            index++;

            if (index === modelsId.length) {
              resolve();
            }
          });
        }
      })
    );
  }

  end = Date.now();

  const handlesInfo = {
    modals: globalModelsIds.size,
    handles: globalUsersHandles.size,
    time: formatMilliseconds(end - start),
  };

  save(
    `${JSON.stringify(
      Array.from(globalUsersHandles.values())
    )}ParsInfo:${JSON.stringify(handlesInfo)}`,
    path.join(__dirname, "output/meta.txt")
  );

  workersCounter = globalProxyMeta.length;

  for (const meta of Array.from(globalUsersHandles.values())) {
    globalUsersMetaCache.push(meta);
  }

  for (const proxy of globalProxyMeta) {
    const metaList = getUsersMeta();

    worker(metaList, proxy);
  }
};

userParserEvent.on("parser", (proxy) => {
  if (globalUsersMetaCache.length === 0) {
    workersCounter--;

    console.log("worker finished", workersCounter);

    if (workersCounter === 0) {
      finallyAction();
    }

    return;
  }

  const metaList = getUsersMeta();

  worker(metaList, proxy);
});

usersPars();
