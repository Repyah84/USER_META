// @ts-check

"use strict";

/**
 * @param {string} data
 * @returns {string | null}
 */
export const findUserMeta = (data) => {
  "use strict";

  const regex = /https:\/\/www\.manyvids\.com\/Activity\/[^\/]+\/\d+/;

  const result = data.match(regex);

  return result ? result[0] : null;
};
