// @ts-check

"use strict";

/** @type {Map<string, string[]>} */
const userHandles = new Map();

/**
 * @param {string} key
 * @param {string[]} data
 * @returns {void}
 */
const addUserHandle = (key, data) => {
  userHandles.set(key, data);
};

/**
 * @param {string} key
 * @returns {string[] | undefined}
 */
const getUserHandle = (key) => {
  return userHandles.get(key);
};

/**
 * @returns {Array<string[]>}
 */
const getUsersHandleValue = () => {
  return Array.from(userHandles.values());
};

/**
 * @returns {Array<string>}
 */
const getUsersHandleKeys = () => {
  return Array.from(userHandles.keys());
};

/**
 * @returns {number}
 */
const getUsersHandleSize = () => {
  return getUsersHandleValue().length;
};

export {
  addUserHandle,
  getUserHandle,
  getUsersHandleValue,
  getUsersHandleSize,
  getUsersHandleKeys,
};
