// @ts-check

"use strict";

import fetch from "node-fetch";

import { API } from "../const/api.js";
import { request } from "../modules/request.js";

/**
 * @param {string} accessToken
 * @param {string} refreshToken
 * @returns {Promise<Array<string> | null>}
 */
export const getAllUserId = async (accessToken, refreshToken) => {
  try {
    const response = await request(
      (accessToken) =>
        fetch(`${API}/get_all_user_ids`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      accessToken,
      refreshToken
    );

    if (response === null) {
      return null;
    }

    return await /** @type {Promise<Array<string>>} */ (response.json());
  } catch (error) {
    console.log(error);

    return null;
  }
};
