// @ts-check
/// <reference path="../types/add-tags-request.type.js" />
/// <reference path="../types/user-data.type.js" />

"use strict";

import { addTags } from "../api/add-tags.js";
import { login } from "../api/login.js";
import { chunkArray } from "../utils/split-to-chunks.js";

/**
 * @param {Array<UserData>} users
 * @returns {Promise<boolean | null>}
 */
export const addTagsToDataBase = async (users) => {
  /**@type {Array<UserWithTags>} */
  const usersIdsWithTags = users.map((user) => ({
    userId: user.userId,
    tags: user.tags,
  }));

  const usersIdsWithTagsChunk = chunkArray(usersIdsWithTags, 10000);

  try {
    const auth = await login({ password: "admin", username: "admin" });

    if (auth === null) {
      return null;
    }

    const { access_token, refresh_token } = auth;

    for (const users of usersIdsWithTagsChunk) {
      await addTags({ users }, access_token, refresh_token);
    }

    return true;
  } catch (error) {
    console.log(error);

    return null;
  }
};
