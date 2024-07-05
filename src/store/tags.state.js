// @ts-check

"use strict";

/** @type {Map<string, Tag[]>} */
const userHandles = new Map();

/**
 * @param {string} key
 * @param {Tag[]} data
 * @returns {void}
 */
const addTag = (key, data) => {
  userHandles.set(key, data);
};

/**
 * @param {string} key
 * @returns {Tag[] | undefined}
 */
const getTag = (key) => {
  return userHandles.get(key);
};

/**
 * @returns {Array<Tag[]>}
 */
const getTagsValue = () => {
  return Array.from(userHandles.values());
};

/**
 * @returns {Array<string>}
 */
const getTagsKeys = () => {
  return Array.from(userHandles.keys());
};

/**
 * @returns {number}
 */
const getTagsSize = () => {
  return getTagsValue().length;
};

export { addTag, getTag, getTagsValue, getTagsSize, getTagsKeys };
