// @ts-check

import fetch from "node-fetch";

import { API } from "../const/api.js";
import { request } from "../modules/request.js";

/**
 * @typedef {{
 *      listId: string,
 *      userIds: string[]
 * }} RequestData
 * @param {RequestData} body
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

    return await /** @type {Promise<boolean>} */ (response.json());
  } catch (error) {
    console.log(error);

    return null;
  }
};
