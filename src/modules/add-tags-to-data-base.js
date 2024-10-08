// @ts-check
/// <reference path="../types/add-tags-request.type.js" />

"use strict";

import { addTags } from "../api/add-tags.js";
import { login } from "../api/login.js";
import { NAME, PASSWORD } from "../const/auth.js";
import { UserData } from "../models/user.model.js";

/**
 * @param {Array<UserData>} users
 * @returns {Promise<boolean | null>}
 */
export const addTagsToDataBase = async (users) => {
  /**@type {Array<UserWithTags>} */
  const usersIdsWithTags = users.map((user) => ({
    userId: user.userId,
    tags: user.getTags(),
  }));

  try {
    const auth = await login({ password: PASSWORD, username: NAME });

    if (auth === null) {
      return null;
    }

    const { access_token, refresh_token } = auth;

    await addTags({ users: usersIdsWithTags }, access_token, refresh_token);

    return true;
  } catch (error) {
    console.log(error);

    return null;
  }
};
