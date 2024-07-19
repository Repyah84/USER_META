// @ts-check
/// <reference path="../types/user.type.js" />

"use strict";

import { getUserMeta } from "./get-user-model.js";

/**
 * @param {string []}usersMeta
 * @returns {User[]}
 */
export const getUsersModel = (usersMeta) =>
  usersMeta.map((meta) => {
    return getUserMeta(meta);
  });
