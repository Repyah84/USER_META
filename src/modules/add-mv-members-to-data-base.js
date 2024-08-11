// @ts-check
///<reference path="../types/mv-member.js" />

"use strict";

import { login } from "../api/login.js";

import { chunkArray } from "../utils/split-to-chunks.js";
import { NAME, PASSWORD } from "../const/auth.js";
import { UserData } from "../models/user.model.js";
import { addMvMembers } from "../api/add-mv-members.js";

/**
 * @param {Array<UserData>} users
 * @returns {Promise<void>}
 */
export const addUsersToDataBase = async (users) => {
  const auth = await login({ password: PASSWORD, username: NAME });

  if (auth === null) {
    return;
  }

  const { access_token, refresh_token } = auth;

  /**@type {MvMember[][]} */
  const usersModelList = chunkArray(
    users.map((user) => ({ userId: user.userId, mv_member: user.mv_member })),
    10000
  );

  for (const usersModel of usersModelList) {
    const response = await addMvMembers(
      { users: usersModel },
      access_token,
      refresh_token
    );

    if (response === null) {
      console.log("Mv Members was not add");
    } else {
      console.log("Mv Members add");
    }
  }
};
