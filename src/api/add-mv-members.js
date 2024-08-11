// @ts-check
/// <reference path="../types/mv-member.js" />

"use strict";

import fetch from "node-fetch";
import { API } from "../const/api.js";
import { request } from "../modules/request.js";

/**
 * @param {{users: Array<MvMember>}} data
 * @param {string}accessToken
 * @param {string}refreshToken
 * @returns {Promise<string | null>}
 */
export const addMvMembers = async (data, accessToken, refreshToken) => {
  try {
    const response = await request(
      (accessToken) =>
        fetch(`${API}/update_mv_member/`, {
          method: "PUT",
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
