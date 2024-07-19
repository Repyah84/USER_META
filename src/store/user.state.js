// @ts-check

"use strict";

import { UserData } from "../models/user.model.js";

/**@type {Map<string, UserData>} */
const usersState = new Map();

/**
 * @param {string} key
 * @param {UserData} data
 * @returns {void}
 */
const addUserToState = (key, data) => {
  usersState.set(key, data);
};

/**
 * @param {string} key
 * @returns {UserData | undefined}
 */
const getUserState = (key) => {
  return usersState.get(key);
};

/**
 * @returns {Array<UserData>}
 */
const getUsersValues = () => {
  return Array.from(usersState.values());
};

/**
 * @returns {number}
 */
const getUsersSize = () => {
  return getUsersValues().length;
};

/**
 * @returns {Array<string>}
 */
const getUsersKeys = () => {
  return Array.from(usersState.keys());
};

/**
 * @returns {[string, UserData][]}
 */
const getUsersEntries = () => {
  return Array.from(usersState.entries());
};

export {
  addUserToState,
  getUserState,
  getUsersKeys,
  getUsersValues,
  getUsersSize,
  getUsersEntries,
};
