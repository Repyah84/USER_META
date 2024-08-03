// @ts-check

"use strict";

/**
 * @param {string} stroke
 * @returns {string}
 */
export const serializeString = (stroke) => {
  return stroke.replace(/\s+/g, "");
};
