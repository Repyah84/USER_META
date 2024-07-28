// @ts-check
/// <reference path="../types/user.type.js"/>

"use strict";

import { addList } from "../api/add-list.js";
import { login } from "../api/login.js";
import { addUsers } from "../api/add-users.js";
import { addUsersToList } from "../api/add-users-to-list.js";

import { chunkArray } from "../utils/split-to-chunks.js";
import { getAllUserId } from "../api/get-all-users-id.js";
import { UserData } from "../models/user.model.js";

/**
 * @param {string}listName
 * @param {Array<UserData>} usersData
 * @returns {Promise<void>}
 */
export const addNewUserToDataBase = async (listName, usersData) => {
  /** @type {Set<string>} */
  const compareUsers = new Set();

  /** @type {Array<User>} */
  const newUsers = [];

  const auth = await login({ password: "ghqosx01293", username: "admin" });

  if (auth === null) {
    return;
  }

  const { access_token, refresh_token } = auth;

  const allUsersId = await getAllUserId(access_token, refresh_token);

  if (allUsersId === null) {
    console.log("allUsersId is empty");

    return;
  }

  for (const id of allUsersId) {
    compareUsers.add(id);
  }

  for (const userData of usersData) {
    if (!compareUsers.has(userData.userId)) {
      newUsers.push(userData.getUserData());
    }
  }

  console.log("newUsers.length", newUsers.length);

  if (newUsers.length === 0) {
    return;
  }

  const list = await addList(listName, access_token, refresh_token);

  if (list === null) {
    console.log("List was not add");

    return;
  }

  const { listId } = list;

  const usersModelList = chunkArray(newUsers, 10000);

  for (const usersModel of usersModelList) {
    console.log("usersModel", usersModel.length);

    const userIds = usersModel.map(({ userId }) => userId);

    await /** @type {Promise<void>} */ (
      new Promise((resolve) => {
        addUsers({ users: usersModel }, access_token, refresh_token)
          .then((response) => {
            if (response === null) {
              console.log("Users was not add");

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
