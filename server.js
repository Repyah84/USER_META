// @ts-check

"use strict";

import path from "path";
import { fileURLToPath } from "url";

import { addUsersToDataBase } from "./src/modules/add-users-to-data-base.js";

import { getUsers } from "./src/api/get-users.js";
import { getUser } from "./src/api/get-user.js";
import { findUserMeta } from "./src/utils/find-user-meta.js";
import { save } from "./src/modules/save.js";
import { formatMilliseconds } from "./src/utils/time.js";
import { getModels } from "./src/api/get-models.js";
import { chunkArray } from "./src/utils/split-to-chunks.js";
import { proxyIs } from "./src/modules/proxy-is.js";
import { PROXY } from "./src/const/proxy.js";

import { META } from "./src/const/test-data.js";

import { userIsVip } from "./src/utils/user-is-vip.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST = false;

const MAX_LENGTH = TEST ? 20 : Infinity;

let workers = 0;
let indexData = -1;

let start = 0;
let end = 0;

/** @type {Set<string>} */
const modelsIds = new Set();

/** @type {Set<string>} */
const usersHandles = new Set();

/** @type {Array<string>} */
const usersMeta = [];

/** @type {Array<string>} */
const proxyMeta = [];

/** @type {Array<string>} */
const proxyRotten = [];

/**
 * @param {string[]} proxyList
 * @returns {Promise<void>}
 */
const initProxy = async (proxyList) => {
  for (const meta of proxyList) {
    const res = await proxyIs(meta);

    console.log(res);

    if (res) {
      proxyMeta.push(meta);
    } else {
      proxyRotten.push(meta);
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

        modelsIds.add(model.guid);
      }
    }
  }

  const filter = TEST ? 1 : !modelsResponse || modelsResponse.totalPages;

  if (filter === page) {
    console.log("MODELS_ID_READY", modelsIds.size);

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

        usersHandles.add(user.handle);
      }
    });
  }

  if (usersHandles.size >= MAX_LENGTH) {
    return;
  }

  if (usersResponse?.success?.next) {
    await users(modalId, usersResponse.success.next);
  }
};

/**
 * @param {number} index
 * @param {string[]} usersHandlesList
 * @returns
 */
const getUserMeta = (usersHandlesList, index) => usersHandlesList[index];

/**
 *
 * @param {(value: string[], idex: number) => string} metaFn
 * @param {string} proxy
 * @param {string[]}usersHandlesList
 * @param {() => void} finallyActionFn
 */
const worker = async (metaFn, proxy, usersHandlesList, finallyActionFn) => {
  do {
    indexData++;

    const userMeta = metaFn(usersHandlesList, indexData);

    await new Promise((resolve) => {
      getUser(userMeta, proxy)
        .then((userMetaResponse) => {
          if (userMetaResponse) {
            const meta = findUserMeta(userMetaResponse);

            if (meta !== null) {
              console.log("USER META_ADD", meta);

              usersMeta.push(meta);
            }
          }
        })
        .finally(() => {
          setTimeout(resolve, 2000);
        });
    });
  } while (indexData < usersHandlesList.length);

  workers--;

  if (workers === 0) {
    finallyActionFn();
  }
};

/**
 * @returns
 */
const finallyAction = () => {
  end = Date.now();

  const info = {
    all: usersHandles.size,
    active: usersMeta.length,
    time: formatMilliseconds(end - start),
  };

  save(
    `${JSON.stringify(usersMeta)}ParsInfo:${JSON.stringify(info)}`,
    path.join(__dirname, "output/users.txt")
  );

  // addUsersToDataBase("All_USERS_PARSER", usersMeta).then(() => {
  //   console.log("Data is saved to data base");
  // });
};

/**
 * @returns {Promise<void>}
 */
const usersPars = async () => {
  await initProxy(PROXY);

  save(
    `proxyMeta${JSON.stringify(proxyMeta)}length:${
      proxyMeta.length
    }/proxyRotten${JSON.stringify(proxyRotten)}length:${proxyRotten.length}`,
    path.join(__dirname, "output/proxy.txt")
  );

  start = Date.now();

  await models(0);

  const chunksModelsId = chunkArray(Array.from(modelsIds.values()), 100);

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
    modals: modelsIds.size,
    handles: usersHandles.size,
    time: formatMilliseconds(end - start),
  };

  save(
    `${JSON.stringify(
      Array.from(usersHandles.values())
    )}ParsInfo:${JSON.stringify(handlesInfo)}`,
    path.join(__dirname, "output/meta.txt")
  );

  workers = proxyMeta.length;

  const data = META;

  for (let i = 0; i < workers; i++) {
    const proxy = proxyMeta[i];

    worker(getUserMeta, proxy, data, finallyAction);
  }
};

usersPars();
