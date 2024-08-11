// @ts-check
///<reference path="./src/types/user.type.js" />

"use strict";

import { UserData } from "./src/models/user.model.js";
import { addNewUserToDataBase } from "./src/modules/add-new-users-to-data-base.js";
import { readFile } from "./src/modules/read.js";

(async () => {
  try {
    const usersDataFromFile = await readFile("./output/users.txt");

    if (usersDataFromFile === null) {
      return;
    }

    /**@type {UserDataFromFile}*/
    const usersData = JSON.parse(usersDataFromFile);

    const users = usersData.users.map(
      ([_key, { avatar_url, status, userId, username, mv_member }]) =>
        new UserData(userId, username, status, avatar_url, mv_member)
    );

    await addNewUserToDataBase(
      `NEW_USER_FROM_PARS:${new Date(Date.now())}`,
      users
    );

    console.log("Data was add to data base");
  } catch (error) {
    console.log(error);
  }
})();

/**
 * @typedef {Object} UserDataFromFile
 * @property {[string, User][]} users
 * @property {number} length
 */
