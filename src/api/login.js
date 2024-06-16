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
    const response = await fetch(`${API}/operator/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // @ts-ignore
    return await response.json();
  } catch {
    return null;
  }
};
