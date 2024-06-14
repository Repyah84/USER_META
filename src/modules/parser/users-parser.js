import path from "path";

import { fileURLToPath } from "url";

import { PROXY } from "../../const/proxy.js";
import { initProxy } from "../proxy/proxy.js";
import { models } from "../models/models.js";
import { users } from "../users/users.js";

import { getUser } from "../../api/get-user.js";

import { formatMilliseconds } from "../../utils/time.js";
import { findUserMeta } from "../../utils/find-user-meta.js";
import { chunkArray } from "../../utils/split-to-chunks.js";
import { save } from "../../utils/save.js";

const USERS_CHUNK_SIZE = 1000;

const USER_PARS_LIMIT = 20;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const userParser = async () => {
  const usersHandles = new Set();

  let start = 0;
  let end = 0;

  // const [proxyMeta, proxyRotten] = await initProxy(PROXY);

  // save(
  //   `proxyMeta${JSON.stringify(proxyMeta)}length:${
  //     proxyMeta.length
  //   }/proxyRotten${JSON.stringify(proxyRotten)}length:${proxyRotten.length}`,
  //   path.join(__dirname, "output/proxy.txt")
  // );

  start = Date.now();

  const modelsIds = await models(0);

  const chunksModelsId = chunkArray(modelsIds, USERS_CHUNK_SIZE);

  for (const modelsId of chunksModelsId) {
    await new Promise((resolve) => {
      let index = 0;

      for (const modelId of modelsId) {
        users(modelId, undefined, USER_PARS_LIMIT).then((response) => {
          response.forEach((user) => {
            usersHandles.add(user);
          });

          index++;

          if (index === modelsId.length) {
            resolve();
          }
        });
      }
    });
  }

  const usersHandlesList = Array.from(usersHandles.values());

  end = Date.now();

  return;

  const handlesInfo = {
    modals: modelsIds.length,
    handles: usersHandlesList.length,
    time: formatMilliseconds(end - start),
  };

  save(
    `${JSON.stringify(usersHandlesList)}ParsInfo:${JSON.stringify(
      handlesInfo
    )}`,
    path.join(__dirname, "output/meta.txt")
  );

  const chunks = chunkArray(usersHandlesList, proxyMeta.length);

  for (const chunk of chunks) {
    await new Promise((resolve) => {
      let index = 0;
      let meatIndex = 0;

      for (const value of chunk) {
        const pr = proxyMeta[meatIndex];

        meatIndex++;

        getUser(value, pr).then((userMetaResponse) => {
          if (userMetaResponse) {
            const meta = findUserMeta(userMetaResponse);

            if (meta !== null) {
              console.log("USER META_ADD", meta);

              usersMeta.push(meta);
            }
          }

          index++;

          if (index === chunk.length) {
            resolve();
          }
        });
      }
    });
  }

  end = Date.now();

  console.log("usersHandles", usersHandlesList.length);
  console.log("usersMeta", usersMeta.length);
  console.log("SPEND_TIME", formatMilliseconds(end - start));

  const info = {
    all: usersHandlesList.length,
    active: usersMeta.length,
    time: formatMilliseconds(end - start),
  };

  save(
    `${JSON.stringify(usersMeta)}ParsInfo:${JSON.stringify(info)}`,
    path.join(__dirname, "output/users.txt")
  );
};
