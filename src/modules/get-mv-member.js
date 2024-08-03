// @ts-check

"use strict";

/**
 * @param {string} str
 * @returns {string | null}
 */
export const getMvMember = (str) => {
  const regex = /<spanclass="mv-model-ranking__ranking__value">(.*?)<\/span>/;

  const match = str.match(regex);

  if (match) {
    return match[1];
  }

  return null;
};
