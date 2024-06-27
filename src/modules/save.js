// @ts-check

"use strict";

import fs from "fs";

/**
 * @param {string} data
 * @param {string} path
 */
export const save = (data, path) => {
  fs.writeFile(path, data, "utf8", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Data successfully written to file:", path);
    }
  });
};

/**
 * @param {string} data
 * @param {string} path
 */
export const saveSync = (data, path) => {
  try {
    fs.writeFileSync(path, data, "utf8");
    console.log("Data successfully written to file:", path);
  } catch (err) {
    console.error("Error writing to file:", err);
  }
};
