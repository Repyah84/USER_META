// @ts-check

"use strict";

import { promises as fs } from "fs";
import path from "path";

/**
 * @param {string} filePath
 * @returns {Promise<string | null>}
 */
export const readFile = async (filePath) => {
  try {
    const fp = path.resolve(filePath);

    await fs.access(fp);

    const data = await fs.readFile(fp, "utf8");

    return data;
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`Файл не существует: ${filePath}`);
    } else {
      console.error(`Ошибка при чтении файла: ${err}`);
    }

    return null;
  }
};
