// @ts-check
/// <reference path="../types/auth.type.js" />

"use strict";

import { API } from "../const/api.js";

import fetch from "node-fetch";

/**
 * @param {string} refreshToken
 * @returns {Promise<AuthResponse| null>}
 */
export const refresh = async (refreshToken) => {
  const params = new URLSearchParams();
  params.append("refresh_token", refreshToken);

  const data = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(`${API}/token/refresh?${params}`, data);

    if (!response.ok) {
      return null;
    }

    return await /** @type {Promise<AuthResponse>} */ (response.json());
  } catch (error) {
    console.log(error);

    return null;
  }
};
