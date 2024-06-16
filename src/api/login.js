// @ts-check
/// <reference path="../types/auth.type.js" />

"use strict";

import { API } from "../const/api.js";

import fetch from "node-fetch";

/**
 * @param {AuthRequest} body
 * @returns {Promise<AuthResponse| null>}
 */
export const login = async (body) => {
  try {
    const response = await fetch(`${API}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return await /** @type {Promise<AuthResponse>} */ (response.json());
  } catch (error) {
    console.log(error);

    return null;
  }
};
