// @ts-check
/// <reference path="../types/add-tags-request.type.js" />

"use strict";

import { addTags } from "../api/add-tags.js";
import { login } from "../api/login.js";
import { UserData } from "../models/user.model.js";
import { chunkArray } from "../utils/split-to-chunks.js";

/**
 * @param {Array<UserData>} users
 * @returns {Promise<boolean | null>}
 */
export const addTagsToDataBase = async (users) => {
  /**@type {Array<UserWithTags>} */
  const usersIdsTthTags = users.map((user) => ({
    userId: user.userId,
    tags: user.getTags(),
  }));

  const usersIdsTthTagsChunk = chunkArray(usersIdsTthTags, 10000);

  try {
    const auth = await login({ password: "admin", username: "admin" });

    if (auth === null) {
      return null;
    }

    const { access_token, refresh_token } = auth;

    for (const tags of usersIdsTthTagsChunk) {
      await addTags({ users: tags }, access_token, refresh_token);
    }

    return true;
  } catch (error) {
    console.log(error);

    return null;
  }
};
