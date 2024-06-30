// @ts-check

"use strict";

import { readFile } from "node:fs/promises";

/**
 *@returns {Promise<string[] | undefined>}
 */
export const readProxyFile = async () => {
  try {
    const promise = await readFile("input/proxies.txt");

    const data = promise.toString();

    const proxy = data.split("\n");

    return proxy;
  } catch (err) {
    console.error(err);
  }
};
