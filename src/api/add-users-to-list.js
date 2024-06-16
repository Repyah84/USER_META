// @ts-check

"use strict";

import fetch from "node-fetch";

import { API } from "../const/api.js";
import { request } from "../utils/request.js";

/**
 * @param {{
 *      listId: string,
 *      userIds: string[]
 * }} body
 * @param {string} accessToken
 * @param {string} refreshToken
 * @returns {Promise<boolean | null>}
 */
export const addUsersToList = async (body, accessToken, refreshToken) => {
  try {
    const response = await request(
      (accessToken) =>
        fetch(`${API}/add_users_to_list`, {
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
