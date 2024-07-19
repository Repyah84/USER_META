// @ts-check
///<reference path="../types/tag.type.js" />

"use strict";

/** @type {Map<string, Tag[]>} */
const tags = new Map();

/**
 * @param {string} key
 * @param {Tag[]} data
 * @returns {void}
 */
const addTag = (key, data) => {
  tags.set(key, data);
};

/**
 * @param {string} key
 * @returns {Tag[] | undefined}
 */
const getTag = (key) => {
  return tags.get(key);
};

/**
 * @returns {Array<Tag[]>}
 */
const getTagsValue = () => {
  return Array.from(tags.values());
};

/**
 * @returns {Array<string>}
 */
const getTagsKeys = () => {
  return Array.from(tags.keys());
};

/**
 * @returns {number}
 */
const getTagsSize = () => {
  return getTagsValue().length;
};

/**
 * @returns {[string, Tag[]][]}
 */
const getTagsEntries = () => {
  return Array.from(tags.entries());
};

export {
  addTag,
  getTag,
  getTagsValue,
  getTagsSize,
  getTagsKeys,
  getTagsEntries,
};
