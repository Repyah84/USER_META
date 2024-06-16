// @ts-check

"use strict";

/**
 * @template T
 * @param {T[]} list
 * @param {(value: T) => Promise<T>} load
 * @param {(value: T) => void} action
 * @returns {Promise<void>}
 */
export const lazyLoad = (list, load, action) =>
  new Promise((resolve) => {
    let index = 0;

    for (const value of list) {
      load(value).then((r) => {
        action(r);

        index++;

        if (index === list.length) {
          resolve();
        }
      });
    }
  });
