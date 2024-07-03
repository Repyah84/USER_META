// @ts-check
/// <reference path="../types/add-tags-request.type.js" />

"use strict";

import { addTags } from "../api/add-tags";
import { UserData } from "../models/user.model";
import { chunkArray } from "../utils/split-to-chunks";

/**
 * @param {Array<UserData>} users
 * @param {string}accessToken
 * @param {string}refreshToken
 */
export const addTagsToDataBase = async (users, accessToken, refreshToken) => {
  /**@type {Array<UserWithTags>} */
  const usersIdsTthTags = users.map((user) => ({
    userId: user.userId,
    tags: user.getTags(),
  }));

  const usersIdsTthTagsChunk = chunkArray(usersIdsTthTags, 10000);

  try {
    for (const tags of usersIdsTthTagsChunk) {
      await addTags({ users: tags }, accessToken, refreshToken);
    }

    return true;
  } catch (error) {
    console.log(error);
  }
};
