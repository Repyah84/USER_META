// @ts-check

"use strict";

import { addList } from "../api/add-list.js";
import { login } from "../api/login.js";
import { addUsers } from "../api/add-users.js";
import { addUsersToList } from "../api/add-users-to-list.js";

import { getUsersModel } from "../utils/get-users-model.js";
import { chunkArray } from "../utils/split-to-chunks.js";

/**
 * @param {string}listName
 * @param {string[]} users
 * @returns {Promise<void>}
 */
export const addUsersToDataBase = async (listName, users) => {
  const auth = await login({ password: "admin", username: "admin" });

  if (auth === null) {
    return;
  }

  const { access_token, refresh_token } = auth;

  const list = await addList(listName, access_token, refresh_token);

  if (list === null) {
    return;
  }

  const { listId } = list;

  const usersModelList = chunkArray(getUsersModel(users), 10000);

  for (const usersModel of usersModelList) {
    const userIds = usersModel.map(({ userId }) => userId);

    await /** @type {Promise<void>} */ (
      new Promise((resolve) => {
        addUsers({ users: usersModel }, access_token, refresh_token)
          .then((response) => {
            if (response === null) {
              resolve();
            }

            return addUsersToList(
              { listId, userIds },
              access_token,
              refresh_token
            );
          })
          .finally(() => {
            resolve();
          });
      })
    );
  }
};
