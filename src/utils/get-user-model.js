// @ts-check
/// <reference  path="../types/user.type.js"/>

"use strict";

/**
 *
 * @param {string} meta
 * @returns {User}
 */
export const getUserMeta = (meta) => {
  const splitMeta = meta.split("/");

  return {
    avatar_url: "",
    status: "custom",
    userId: splitMeta[splitMeta.length - 1],
    username: splitMeta[splitMeta.length - 2],
  };
};
