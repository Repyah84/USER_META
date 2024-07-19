// @ts-check
/// <reference path="./src/types/parser-dto.type.js" />
/// <reference path="./src/types/user.type.js" />

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

import {
  getModel,
  addModel,
  getModelsValue,
  getModelsSize,
  getModelEntries,
} from "./src/store/models.state.js";

import {
  getUserHandle,
  addUserHandle,
  getUsersHandleSize,
  getUsersHandleKeys,
  getUsersHandleEntries,
} from "./src/store/user-handles.state.js";

import {
  getUsersValues,
  addUserToState,
  getUsersSize,
  getUsersEntries,
} from "./src/store/user.state.js";

import {
  addTag,
  getTag,
  getTagsSize,
  getTagsEntries,
} from "./src/store/tags.state.js";
import { UserData } from "./src/models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tagsAddToDateBase = new EventEmitter();

const userParserEvent = new EventEmitter();

/** @type {number} */
let START = 0;

/** @type {number} */
let END = 0;

/** @type {number} */
let WORKERS_COUNTER = 50;

/** @type {null | NodeJS.Timeout} */
let INTERVAL = null;

/**@type {number} */
let TAGS_INDEX = 0;

/** @type {boolean} */
const TEST = false;

/** @type {number} */
const MAX_LENGTH = TEST ? 1000 : Infinity;

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
function stopMetric() {
  if (INTERVAL === null) {
    return;
  }

  clearInterval(INTERVAL);

  INTERVAL = null;
}

/**
 * @param {string[]} proxyList
 * @returns {Promise<void>}
 */
async function initProxy(proxyList) {
  for (const proxy of proxyList) {
    const res = await proxyIs(proxy);

    console.log(res, `${proxy}`);

    if (res) {
      PROXY_META.push(proxy);
    } else {
      PROXY_ROTTEN.push(proxy);
    }
  }
}

/**
 * @param {number} page
 * @returns
 */
async function models(page) {
  const modelsResponse = await getModels(page);

  if (modelsResponse !== null) {
    for (const model of modelsResponse.creators) {
      if (model.guid && !getModel(model.guid)) {
        const { guid, id } = model;

        addModel(guid, { id, guid });
      }
    }
  }

  const filter = TEST ? 1 : !modelsResponse || modelsResponse.totalPages;

  if (filter === page) {
    return;
  }

  page++;

  await models(page);
}

async function tags() {
  const modelsChunk = chunkArray(getModelsValue(), PROXY_META.length);

  for (const models of modelsChunk) {
    await /** @type {Promise<void>} */ (
      new Promise((resolve) => {
        let index = 0;

        for (const { id, guid } of models) {
          const proxy = getProxy();

          getTags(id, proxy)
            .then((tags) => {
              if (tags === null) {
                return;
              }

              addTag(guid, tags.data);
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
}

/**
 * @returns {void}
 */
function addTagsToDataBase() {
  tagsWorker(TAGS_INDEX);
}

/**
 * @returns {Promise<void>}
 */
async function saveNewUserDataToBack() {
  await addNewUserToDataBase(
    `NEW_USERS_PARSER${new Date(Date.now())}`,
    getUsersValues()
  );

  console.log("Data is saved to data base");
}

/**
 * @param {string} modalId
 * @param {string | undefined} next
 * @returns {Promise<void>}
 */
async function users(modalId, next) {
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
}

/**
 * @param {number} index
 * @returns {void}
 */
function tagsWorker(index) {
  const childProcess = spawn("node", ["tags.js", `${index}`]);

  childProcess.stdout.on("data", (data) => {
    const dataFromChild = data.toString();

    console.log(dataFromChild);

    if (dataFromChild === "[DATA FROM CHILD STOP SESSION]") {
      console.log("SESSION COMPLETE");

      process.exit(0);
    }
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`[PARENT] stderr from child: ${data}`);

    tagsAddToDateBase.emit("tags");
  });

  childProcess.on("close", () => {
    tagsAddToDateBase.emit("tags");
  });

  childProcess.on("error", (err) => {
    console.error(`[PARENT] Error spawning child process: ${err}`);

    tagsAddToDateBase.emit("tags");
  });
}

/**
 * @param {string} meta
 * @param {string} proxy
 * @returns {void}
 */
function worker(meta, proxy) {
  const childProcess = spawn("node", ["parser.js", `${meta}`, `${proxy}`]);

  childProcess.stdout.on("data", (data) => {
    const dataFromChild = data.toString();

    if (dataFromChild.startsWith("[ERROR FROM CHILD]")) {
      console.log("[ERROR FROM CHILD]", dataFromChild);

      return;
    }

    if (!dataFromChild.startsWith("[DATA FROM CHILD]")) {
      return;
    }

    /**@type {string} */
    const userSt = dataFromChild.split("[DATA FROM CHILD]")[1];

    /**@type {User} */
    const { userId, status, username, avatar_url } = JSON.parse(userSt);

    addUserToState(meta, new UserData(userId, username, status, avatar_url));
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
}

/**
 * @returns {Promise<void>}
 */
async function finallyAction() {
  stopMetric();

  END = Date.now();

  const info = {
    all: getUsersHandleSize(),
    active: getUsersSize(),
    time: formatMilliseconds(END - START),
  };

  console.dir(info);

  const users = getUsersEntries().map(([key, user]) => [
    key,
    user.getUserData(),
  ]);

  saveSync(
    JSON.stringify({
      users: users,
      length: users.length,
    }),
    path.join(__dirname, "output/users.txt")
  );

  if (TEST) {
    console.log("Parser run successfully");

    process.exit(0);
  }

  await saveNewUserDataToBack();

  addTagsToDataBase();
}

/**
 * @returns {string}
 */
function getUsersMeta() {
  const meta = USERS_META_CACHE.shift();

  if (meta === undefined) {
    throw new Error("USERS_META_CACHE invalid");
  }

  return meta;
}

/**
 * @returns {string}
 */
function getProxy() {
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
}

/**
 * @returns {Promise<void>}
 */
async function usersPars() {
  START = Date.now();

  await initProxy(PROXY);

  save(
    JSON.stringify({
      proxyMeta: {
        data: PROXY_META,
        length: PROXY_META.length,
      },
      proxyRotten: {
        data: PROXY_ROTTEN,
        length: PROXY_ROTTEN.length,
      },
    }),
    path.join(__dirname, "output/proxy.txt")
  );

  console.log("[MODELS_PARSER_START]");

  await models(0);

  console.log("[MODELS_PARSER_END]", getModelsSize());

  save(
    JSON.stringify({
      models: getModelEntries(),
      length: getModelsSize(),
    }),
    path.join(__dirname, "output/models.txt")
  );

  console.log("[TAGS_PARSER_START]");

  await tags();

  console.log("[TAGS_PARSER_END]");

  saveSync(
    JSON.stringify({
      tags: getTagsEntries(),
      length: getTagsSize(),
    }),
    path.join(__dirname, "output/tags.txt")
  );

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
    JSON.stringify({
      userHandle: getUsersHandleEntries(),
      length: getUsersHandleSize(),
    }),
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
}

tagsAddToDateBase.on("tags", () => {
  TAGS_INDEX++;

  tagsWorker(TAGS_INDEX);
});

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
