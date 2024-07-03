// @ts-check
/// <reference path="../types/add-tags-request.type.js" />

"use strict";

import fetch from "node-fetch";
import { API } from "../const/api.js";
import { request } from "../modules/request.js";

/**
 * @param {{users: Array<UserWithTags>}} data
 * @param {string}accessToken
 * @param {string}refreshToken
 * @returns {Promise<string | null>}
 */
export const addTags = async (data, accessToken, refreshToken) => {
  try {
    const response = await request(
      (accessToken) =>
        fetch(`${API}//add_tags`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }),
      accessToken,
      refreshToken
    );

    if (response === null) {
      return null;
    }

    return await /** @type {Promise<string>} */ (response.json());
  } catch (error) {
    console.log(error);

    return null;
  }
};
