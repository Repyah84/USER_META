// @ts-check

"use strict";

import { readFile } from "./src/modules/read.js";

import { addMvMembers } from "./src/api/add-mv-members.js";
import { PASSWORD, NAME } from "./src/const/auth.js";
import { chunkArray } from "./src/utils/split-to-chunks.js";
import { login } from "./src/api/login.js";

/**
 * @param {Array<User>} users
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

(async () => {
  const usersDataFromFile = await readFile("./output/users.txt");

  if (usersDataFromFile === null) {
    return;
  }

  /**@type {import("./tags").UsersDataFromFile} */
  const userData = JSON.parse(usersDataFromFile);

  /**@type {User[]} */
  const users = userData.users.map(([_key, user]) => user);

  await addUsersToDataBase(users);

  console.log("mv_members add success");
})();
