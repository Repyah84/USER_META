// @ts-check
/// <reference path="../types/list.type.js" />

"use strict";

import fetch from "node-fetch";

import { API } from "../const/api.js";
import { request } from "../modules/request.js";

/**
 * @param {string} listName
 * @param {string} accessToken
 * @param {string} refreshToken
 * @returns {Promise<List | null> }
 */
export const addList = async (listName, accessToken, refreshToken) => {
  const body = {
    userId: "admin",
    name: listName,
  };

  try {
    const response = await request(
      (accessToken) =>
        fetch(`${API}/create_user_list/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        }),
      accessToken,
      refreshToken
    );

    if (response === null) {
      return null;
    }

    return await /** @type {Promise<List>} */ (response.json());
  } catch (error) {
    console.log(error);

    return null;
  }
};
