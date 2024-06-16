// @ts-check
/// <reference path="../types/user.type.js" />

"use strict";

import fetch from "node-fetch";

import { API } from "../const/api.js";
import { request } from "../utils/request.js";

/**
 * @param {{users: User[]}} body
 * @param {string} accessToken
 * @param {string} refreshToken
 * @returns {Promise<boolean | null>}
 */
export const addUsers = async (body, accessToken, refreshToken) => {
  try {
    const response = request(
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

    // @ts-ignore
    return await response.json();
  } catch {
    return null;
  }
};
