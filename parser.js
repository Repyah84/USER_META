// @ts-check
/// <reference path="./src/types/user-data.type.js" />

"use strict";

import { getUser } from "./src/api/get-user.js";
import { findUserMeta } from "./src/utils/find-user-meta.js";
import { getUserMeta } from "./src/utils/get-user-model.js";

import { getModel } from "./src/store/models.state.js";

import { getUserHandle } from "./src/store/user-handles.state.js";

setTimeout(async () => {
  try {
    const [userMeta, proxy] = process.argv.slice(2);

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

    const modelsIdList = getUserHandle(userMeta);

    // console.log("PARSER", modelsIdList);

    if (modelsIdList === undefined) {
      return;
    }

    for (const modelId of modelsIdList) {
      const modelData = getModel(modelId);

      if (modelData === undefined) {
        return;
      }

      for (const { label } of modelData.tags) {
        tags.add(label);
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
