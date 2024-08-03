// @ts-check

"use strict";

/**
 * @param {Array<any>} cookies
 * @returns {string}
 */
export const formatCookies = (cookies) => {
  return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
};
