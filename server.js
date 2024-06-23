// @ts-check

"use strict";

import path from "path";
import { fileURLToPath } from "url";

import { addUsersToDataBase } from "./src/modules/add-users-to-data-base.js";
import { spawn } from "node:child_process";

import { getUsers } from "./src/api/get-users.js";

import { save, saveSync } from "./src/modules/save.js";
import { formatMilliseconds } from "./src/utils/time.js";
import { getModels } from "./src/api/get-models.js";
import { chunkArray } from "./src/utils/split-to-chunks.js";
import { proxyIs } from "./src/modules/proxy-is.js";
import { PROXY } from "./src/const/proxy.js";

import EventEmitter from "node:events";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userParserEvent = new EventEmitter();

/** @type {number} */
let START = 0;

/** @type {number} */
let END = 0;

/** @type {number} */
let WORKERS_COUNTER = 0;

/** @type {null | NodeJS.Timeout} */
let INTERVAL = null;

/** @type {boolean} */
const TEST = true;

/** @type {number} */
const MAX_LENGTH = TEST ? 20 : Infinity;

/** @type {Set<string>} */
const MODELS_ID = new Set();

/** @type {Set<string>} */
const USERS_HANDLES = new Set();

/** @type {Array<string>} */
const USERS_META = [];

/** @type {Array<string>} */
const USERS_META_CACHE = [];

/** @type {Array<string>} */
const PROXY_META = [];

/** @type {Array<string>} */
const PROXY_ROTTEN = [];

/**
 * @returns {void}
 */
const runMetric = () => {
  INTERVAL = setInterval(() => {
    console.log("ELEMENTS_LEFT", USERS_META_CACHE.length);
  }, 60000);
};

/**
 * @returns {void}
 */
const stopMetric = () => {
  if (INTERVAL === null) {
    return;
  }

  clearInterval(INTERVAL);

  INTERVAL = null;
};

/**
 * @param {string[]} proxyList
 * @returns {Promise<void>}
 */
const initProxy = async (proxyList) => {
  for (const meta of proxyList) {
    const res = await proxyIs(meta);

    console.log(res);

    if (res) {
      PROXY_META.push(meta);
    } else {
      PROXY_ROTTEN.push(meta);
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
        MODELS_ID.add(model.guid);
      }
    }
  }

  const filter = TEST ? 1 : !modelsResponse || modelsResponse.totalPages;

  if (filter === page) {
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
        USERS_HANDLES.add(user.handle);
      }
    });
  }

  if (USERS_HANDLES.size >= MAX_LENGTH) {
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

    USERS_META.push(user);
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`[PARENT] stderr from child: ${data}`);

    userParserEvent.emit("parser", proxy);
  });

  childProcess.on("close", () => {
    userParserEvent.emit("parser", proxy);
  });

  childProcess.on("error", (err) => {
    console.error(`[PARENT] Error spawning child process: ${err}`);

    userParserEvent.emit("parser", proxy);
  });
};

/**
 * @returns {void}
 */
const finallyAction = () => {
  stopMetric();

  END = Date.now();

  const info = {
    all: USERS_HANDLES.size,
    active: USERS_META.length,
    time: formatMilliseconds(END - START),
  };

  console.dir(info);

  saveSync(
    `${JSON.stringify(USERS_META)}ParsInfo:${JSON.stringify(info)}`,
    path.join(__dirname, "output/users.txt")
  );

  addUsersToDataBase("All_USERS_PARSER", USERS_META).then(() => {
    console.log("Data is saved to data base");

    process.exit(0);
  });

  process.exit(0);
};

/**
 * @returns {string}
 */
const getUsersMeta = () => {
  const meta = USERS_META_CACHE[0];

  USERS_META_CACHE.splice(0, 1);

  return meta;
};

/**
 * @returns {Promise<void>}
 */
const usersPars = async () => {
  await initProxy(PROXY);

  save(
    `proxyMeta${JSON.stringify(PROXY_META)}length:${
      PROXY_META.length
    }/proxyRotten${JSON.stringify(PROXY_ROTTEN)}length:${PROXY_ROTTEN.length}`,
    path.join(__dirname, "output/proxy.txt")
  );

  START = Date.now();

  console.log("[MODELS_PARSER_START]");

  await models(0);

  console.log("[MODELS_PARSER_END]", MODELS_ID.size);

  const chunksModelsId = chunkArray(Array.from(MODELS_ID.values()), 100);

  console.log("[USERS_META_PARSER_START]");

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

  END = Date.now();

  const handlesInfo = {
    modals: MODELS_ID.size,
    handles: USERS_HANDLES.size,
    time: formatMilliseconds(END - START),
  };

  console.dir(handlesInfo);

  save(
    `${JSON.stringify(
      Array.from(USERS_HANDLES.values())
    )}ParsInfo:${JSON.stringify(handlesInfo)}`,
    path.join(__dirname, "output/meta.txt")
  );

  console.log("USERS_PARSER_START");

  WORKERS_COUNTER = PROXY_META.length;

  for (const meta of Array.from(USERS_HANDLES.values())) {
    USERS_META_CACHE.push(meta);
  }

  for (const proxy of PROXY_META) {
    const metaList = getUsersMeta();

    worker(metaList, proxy);
  }

  runMetric();
};

userParserEvent.on("parser", (proxy) => {
  if (USERS_META_CACHE.length === 0) {
    WORKERS_COUNTER--;

    if (WORKERS_COUNTER === 0) {
      finallyAction();
    }

    return;
  }

  const metaList = getUsersMeta();

  worker(metaList, proxy);
});

usersPars();
