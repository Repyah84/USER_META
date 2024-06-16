// @ts-check
/// <reference path="../types/user.type.js" />

"use strict";

import fetch from "node-fetch";

import { API } from "../const/api.js";
import { request } from "../modules/request.js";

/**
 * @param {{users: User[]}} body
 * @param {string} accessToken
 * @param {string} refreshToken
 * @returns {Promise<boolean | null>}
 */
export const addUsers = async (body, accessToken, refreshToken) => {
  try {
    const response = await request(
      (accessToken) =>
        fetch(`${API}/add_users`, {
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

    return await /** @type {Promise<boolean>} */ (response.json());
  } catch (error) {
    console.log(error);

    return null;
  }
};
