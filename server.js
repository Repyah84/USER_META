// @ts-check
/// <reference path="./src/types/model-data-parser.js" />
/// <reference path="./src/types/user-data.type.js" />

"use strict";

import path from "path";
import { fileURLToPath } from "url";
import EventEmitter from "node:events";

import { spawn } from "node:child_process";

import { getUsers } from "./src/api/get-users.js";

import { save, saveSync } from "./src/modules/save.js";
import { formatMilliseconds } from "./src/utils/time.js";
import { getModels } from "./src/api/get-models.js";
import { chunkArray } from "./src/utils/split-to-chunks.js";
import { proxyIs } from "./src/modules/proxy-is.js";
import { addNewUserToDataBase } from "./src/modules/add-new-users-to-data-base.js";
import { PROXY } from "./src/const/proxy.js";
import { getTags } from "./src/api/get-tags.js";
import { addTagsToDataBase } from "./src/modules/add-tags-to-data-base.js";

import {
  getModel,
  addModel,
  getModelsValue,
  getModelsSize,
} from "./src/store/models.state.js";

import {
  getUserHandle,
  addUserHandle,
  getUsersHandleSize,
  getUsersHandleKeys,
} from "./src/store/user-handles.state.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userParserEvent = new EventEmitter();

/** @type {number} */
let START = 0;

/** @type {number} */
let END = 0;

/** @type {number} */
let WORKERS_COUNTER = 40;

/** @type {null | NodeJS.Timeout} */
let INTERVAL = null;

/** @type {boolean} */
const TEST = true;

/** @type {number} */
const MAX_LENGTH = TEST ? 20 : Infinity;

/** @type {Array<UserData>} */
const USERS = [];

/** @type {Array<string>} */
const USERS_META_CACHE = [];

/** @type {Array<string>} */
const PROXY_META = [];

/** @type {Array<string>} */
const PROXY_META_CACHE = [];

/** @type {Array<string>} */
const PROXY_ROTTEN = [];

/**
 * @param {Array<unknown>} list
 * @returns {void}
 */
const runMetric = (list) => {
  INTERVAL = setInterval(() => {
    console.log("ELEMENTS_LEFT", list.length);
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
  for (const proxy of proxyList) {
    const res = await proxyIs(proxy);

    console.log(res, `${proxy}`);

    if (res) {
      PROXY_META.push(proxy);
    } else {
      PROXY_ROTTEN.push(proxy);
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
      if (model.guid && !getModel(model.guid)) {
        const { guid, id } = model;

        addModel(guid, { id, guid, tags: [] });
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

const tags = async () => {
  const modelsChunk = chunkArray(getModelsValue(), 100);

  for (const models of modelsChunk) {
    await /** @type {Promise<void>} */ (
      new Promise((resolve) => {
        let index = 0;

        for (const { guid, id } of models) {
          getTags(id)
            .then((tags) => {
              if (tags === null) {
                return;
              }

              const modelMutate = getModel(guid);

              if (modelMutate === undefined) {
                return;
              }

              for (const tag of tags.data) {
                modelMutate.tags.push(tag);
              }
            })
            .finally(() => {
              index++;

              if (index === models.length) {
                resolve();
              }
            });
        }
      })
    );
  }
};

/**
 * @param {string} modalId
 * @param {string | undefined} next
 * @returns {Promise<void>}
 */
const users = async (modalId, next) => {
  const usersResponse = await getUsers(modalId, next);

  if (usersResponse?.success?.users) {
    usersResponse.success.users.forEach((user) => {
      if (user.handle) {
        const handle = user.handle;

        const userHandle = getUserHandle(handle);

        if (userHandle === undefined) {
          addUserHandle(handle, [modalId]);
        } else {
          userHandle.push(modalId);
        }
      }
    });
  }

  if (getUsersHandleSize() >= MAX_LENGTH) {
    return;
  }

  if (usersResponse?.success?.next) {
    await users(modalId, usersResponse.success.next);
  }
};

/**
 * @param {string} meta
 * @param {string} proxy
 * @returns {void}
 */
const worker = (meta, proxy) => {
  console.log(getUsersHandleSize());

  const childProcess = spawn("node", ["parser.js", `${meta}`, `${proxy}`]);

  childProcess.stdout.on("data", (data) => {
    const dataFromChild = data.toString();

    console.log(dataFromChild);

    if (dataFromChild.startsWith("[ERROR FROM CHILD]")) {
      console.log("[ERROR FROM CHILD]", dataFromChild);

      return;
    }

    if (!dataFromChild.startsWith("[DATA FROM CHILD]")) {
      return;
    }

    /** @type {string} */
    const userMeta = dataFromChild.split("[DATA FROM CHILD]")[1];

    USERS.push(JSON.parse(userMeta));
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`[PARENT] stderr from child: ${data}`);

    userParserEvent.emit("parser");
  });

  childProcess.on("close", () => {
    userParserEvent.emit("parser");
  });

  childProcess.on("error", (err) => {
    console.error(`[PARENT] Error spawning child process: ${err}`);

    userParserEvent.emit("parser");
  });
};

/**
 * @returns {void}
 */
const finallyAction = () => {
  stopMetric();

  END = Date.now();

  const info = {
    all: getUsersHandleSize(),
    active: USERS.length,
    time: formatMilliseconds(END - START),
  };

  saveSync(
    `${JSON.stringify(USERS)}ParsInfo:${JSON.stringify(info)}`,
    path.join(__dirname, "output/users.txt")
  );

  if (TEST) {
    process.exit(0);
  } else {
    addNewUserToDataBase(`NEW_USERS_PARSER${new Date(Date.now())}`, USERS)
      .then(() => {
        return addTagsToDataBase(USERS);
      })
      .finally(() => {
        console.log("Data is saved to data base");

        process.exit(0);
      });
  }
};

/**
 * @returns {string}
 */
const getUsersMeta = () => {
  const meta = USERS_META_CACHE.shift();

  if (meta === undefined) {
    throw new Error("USERS_META_CACHE invalid");
  }

  return meta;
};

/**
 * @returns {string}
 */
const getProxy = () => {
  if (PROXY_META_CACHE.length === 0) {
    for (const proxy of PROXY_META) {
      PROXY_META_CACHE.push(proxy);
    }
  }

  const proxy = PROXY_META_CACHE.shift();

  if (proxy === undefined) {
    throw new Error("PROXY_META_CACHE invalid");
  }

  return proxy;
};

/**
 * @returns {Promise<void>}
 */
const usersPars = async () => {
  START = Date.now();

  await initProxy(PROXY);

  save(
    `proxyMeta${JSON.stringify(PROXY_META)}length:${
      PROXY_META.length
    }/proxyRotten${JSON.stringify(PROXY_ROTTEN)}length:${PROXY_ROTTEN.length}`,
    path.join(__dirname, "output/proxy.txt")
  );

  console.log("[MODELS_PARSER_START]");

  await models(0);

  console.log("[MODELS_PARSER_END]", getModelsSize());

  await tags();

  const chunksModels = chunkArray(getModelsValue(), 100);

  console.log("[USERS_META_PARSER_START]");

  for (const models of chunksModels) {
    await /** @type {Promise<void>} */ (
      new Promise((resolve) => {
        let index = 0;

        for (const model of models) {
          users(model.guid, undefined).finally(() => {
            index++;

            if (index === models.length) {
              resolve();
            }
          });
        }
      })
    );
  }

  END = Date.now();

  const handlesInfo = {
    modals: getModelsSize(),
    handles: getUsersHandleSize(),
    time: formatMilliseconds(END - START),
  };

  console.dir(handlesInfo);

  save(
    `${JSON.stringify(getUsersHandleKeys())}ParsInfo:${JSON.stringify(
      handlesInfo
    )}`,
    path.join(__dirname, "output/meta.txt")
  );

  console.log("USERS_PARSER_START");

  for (const handle of getUsersHandleKeys()) {
    USERS_META_CACHE.push(handle);
  }

  for (let i = 0; i < WORKERS_COUNTER; i++) {
    const meta = getUsersMeta();

    const proxy = getProxy();

    worker(meta, proxy);
  }

  runMetric(USERS_META_CACHE);
};

userParserEvent.on("parser", () => {
  if (USERS_META_CACHE.length === 0) {
    WORKERS_COUNTER--;

    if (WORKERS_COUNTER === 0) {
      finallyAction();
    }

    return;
  }

  const meta = getUsersMeta();

  const proxy = getProxy();

  worker(meta, proxy);
});

usersPars();
