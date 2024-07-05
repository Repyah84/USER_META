// @ts-check
/// <reference path="./src/types/user-data.type.js" />
/// <reference path="./src/types/parser-dto.type.js" />

"use strict";

import { getUser } from "./src/api/get-user.js";
import { findUserMeta } from "./src/utils/find-user-meta.js";
import { getUserMeta } from "./src/utils/get-user-model.js";

process.stdin.setEncoding("utf8");

let input = "";

process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  setTimeout(async () => {
    try {
      /**@type {ParserDTO} */
      const { userMeta, proxy, modelsIdList, modelsDada } = JSON.parse(input);

      if (modelsIdList === undefined) {
        return;
      }

      const userMetaResponse = await getUser(userMeta, proxy);

      if (!userMetaResponse) {
        return;
      }

      const meta = findUserMeta(userMetaResponse);

      if (meta === null) {
        return;
      }

      const { userId, username, avatar_url, status } = getUserMeta(meta);

      /**@type {Set<string>} */
      const tags = new Set();

      /**@type {Map<string, ModelDataPars>} */
      const data = new Map();

      for (const modelData of modelsDada) {
        data.set(modelData.guid, modelData);
      }

      for (const modelId of modelsIdList) {
        const modelData = data.get(modelId);

        if (modelData !== undefined) {
          for (const { label } of modelData.tags) {
            tags.add(label);
          }
        }
      }

      /**@type {UserData} */
      const user = {
        userId,
        username,
        avatar_url,
        status,
        tags: Array.from(tags.values()),
      };

      process.stdout.write(`[DATA FROM CHILD]${JSON.stringify(user)}`);
    } catch (error) {
      console.log(`[ERROR FROM CHILD]${error}`);
    } finally {
      process.exit(0);
    }
  }, 1000);
});
