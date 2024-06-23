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
      console.error("Ошибка при записи в файл:", err);
    } else {
      console.log("Данные успешно записаны в файл:", path);
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
    console.log("Данные успешно записаны в файл:", path);
  } catch (err) {
    console.error("Ошибка при записи в файл:", err);
  }
};
