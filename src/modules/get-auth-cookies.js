// @ts-check

"use strict";

import cypress from "cypress";

/**
 * @returns {Promise<void>}
 */
export const getAuthCookies = async () => {
  try {
    await cypress.run({
      spec: "cypress/index.spec.js",
      headless: true,
      browser: "chrome",
    });
  } catch (error) {
    console.log(error);
  }
};
