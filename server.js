import path from "path";

import { fileURLToPath } from "url";
import { getUsers } from "./src/api/get-users.js";
import { getUser } from "./src/api/get-user.js";
import { findUserMeta } from "./src/utils/find-user-meta.js";
import { save } from "./src/utils/save.js";
import { formatMilliseconds } from "./src/utils/time.js";
import { getModels } from "./src/api/get-models.js";
import { chunkArray } from "./src/utils/split-to-chunks.js";
import { lazyLoad } from "./src/utils/lazy-load.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_LENGTH = Infinity;

const modelsIds = [];
const usersHandles = [];
const usersMeta = [];

let start = 0;
let end = 0;

/**
 *
 * @param {number} page
 * @returns
 */
const models = async (page) => {
  const modelsResponse = await getModels(page);

  if (modelsResponse) {
    for (const model of modelsResponse.creators) {
      if (model.guid && !modelsIds.includes(model.guid)) {
        console.log("MODEL_ID_ADD", model.guid);
        modelsIds.push(model.guid);
      }
    }
  }

  if (!modelsResponse || modelsResponse.totalPages === page) {
    console.log("MODELS_ID_READY", modelsIds.length);
    return;
  }

  page++;

  console.log(
    "PAGE",
    page,
    "TOTAL",
    modelsResponse.totalPages,
    "CURRENT",
    modelsIds.length
  );

  await models(page);
};

/**
 *
 * @param {string} modalId
 * @param {string | undefined} next
 */
const users = async (modalId, next) => {
  const usersResponse = await getUsers(modalId, next);

  if (usersResponse?.success?.users) {
    usersResponse.success.users.forEach((user) => {
      if (user.handle && !usersHandles.includes(user.handle)) {
        console.log("USER_HANDLE", user.handle);
        usersHandles.push(user.handle);
      }
    });
  }

  if (usersHandles.length >= MAX_LENGTH) {
    return;
  }

  if (usersResponse?.success?.next) {
    await users(modalId, usersResponse.success.next);
  }
};

const initUserPars = async () => {
  start = Date.now();

  await models(0);

  const chunksModelsId = chunkArray(modelsIds, 100);

  for (const modelsId of chunksModelsId) {
    await new Promise((resolve) => {
      let index = 0;

      for (const modelId of modelsId) {
        users(modelId).then(() => {
          index++;

          if (index === modelsId.length) {
            resolve();
          }
        });
      }
    });
  }

  end = Date.now();

  const handlesInfo = {
    modals: modelsIds,
    handles: usersHandles,
    time: formatMilliseconds(end - start),
  };

  save(
    `${JSON.stringify(usersHandles)}ParsInfo:${JSON.stringify(handlesInfo)}`,
    path.join(__dirname, "output/meta.txt")
  );

  return;

  console.log("GET_USERS_META");

  const chunks = chunkArray(usersHandles, 2);

  const action = (userMetaResponse) => {
    if (userMetaResponse) {
      const meta = findUserMeta(userMetaResponse);

      if (meta !== null) {
        console.log("GET_USER_META", meta);
        usersMeta.push(meta);
      } else {
        console.log("GET_USER_META_DISABLE");
      }
    }
  };

  for (const lazy of chunks) {
    await lazyLoad(lazy, getUser, action);

    console.log("usersHandles, 5");
  }

  // for (const userHandle of usersHandles) {
  //   const userMetaResponse = await getUser(userHandle);

  //   if (userMetaResponse) {
  //     const meta = findUserMeta(userMetaResponse);

  //     if (meta !== null) {
  //       console.log("GET_USER_META", meta);
  //       usersMeta.push(meta);
  //     } else {
  //       console.log("GET_USER_META_DISABLE", userHandle);
  //     }
  //   }
  // }

  end = Date.now();

  console.log("usersHandles", usersHandles.length);
  console.log("usersMeta", usersMeta.length);
  console.log("SPEND_TIME", formatMilliseconds(end - start));

  const info = {
    all: usersHandles.length,
    active: usersMeta.length,
    time: formatMilliseconds(end - start),
  };

  save(
    `${JSON.stringify(usersMeta)}ParsInfo:${JSON.stringify(info)}`,
    path.join(__dirname, "output/users.txt")
  );
};

initUserPars();
