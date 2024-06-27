// @ts-check

"use strict";

import { addList } from "../api/add-list.js";
import { login } from "../api/login.js";
import { addUsers } from "../api/add-users.js";
import { addUsersToList } from "../api/add-users-to-list.js";

import { getUsersModel } from "../utils/get-users-model.js";
import { chunkArray } from "../utils/split-to-chunks.js";
import { getAllUserId } from "../api/get-all-users-id.js";

/**
 * @param {string}listName
 * @param {string[]} usersMeta
 * @returns {Promise<void>}
 */
export const addNewUserToDataBase = async (listName, usersMeta) => {
  /** @type {Set<string>} */
  const compareUsers = new Set();

  /** @type {Array<User>} */
  const newUsers = [];

  const auth = await login({ password: "admin", username: "admin" });

  if (auth === null) {
    return;
  }

  const { access_token, refresh_token } = auth;

  const allUsersId = await getAllUserId(access_token, refresh_token);

  if (allUsersId === null) {
    return;
  }

  for (const id of allUsersId) {
    compareUsers.add(id);
  }

  for (const user of getUsersModel(usersMeta)) {
    if (!compareUsers.has(user.userId)) {
      newUsers.push(user);
    }
  }

  if (newUsers.length === 0) {
    console.log("new users list empty");
    return;
  }

  const list = await addList(listName, access_token, refresh_token);

  if (list === null) {
    return;
  }

  const { listId } = list;

  const usersModelList = chunkArray(newUsers, 1000);

  for (const usersModel of usersModelList) {
    const userIds = usersModel.map(({ userId }) => userId);

    await /** @type {Promise<void>} */ (
      new Promise((resolve) => {
        addUsers({ users: usersModel }, access_token, refresh_token)
          .then((response) => {
            if (response === null) {
              return;
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
