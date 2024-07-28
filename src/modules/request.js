// @ts-check

"use strict";

import { Response } from "node-fetch";
import { refresh } from "../api/refresh.js";

/**
 * @param {(accessToken: string) => Promise<Response>} reg
 * @param {string} accessToken
 * @param {string} refreshToken
 * @returns {Promise<Response | null>}
 */
export const request = async (reg, accessToken, refreshToken) => {
  const response = await reg(accessToken);

  console.log(response.json());

  if (!response.ok) {
    if (response.status === 401) {
      const responseRefresh = await refresh(refreshToken);

      if (responseRefresh) {
        const { access_token } = responseRefresh;

        return await reg(access_token);
      }

      return responseRefresh;
    }

    return null;
  }

  return response;
};
