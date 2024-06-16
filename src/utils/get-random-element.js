// @ts-check

"use strict";

/**
 * @template T
 * @param {T[]} elements
 * @returns {() => T}
 */
export const getRandomElement = (elements) => {
  const mutate = [...elements];

  /**
   *
   * @param {number} number
   * @returns
   */
  const getRandomIndex = (number) => Math.floor(Math.random() * (number + 1));

  const randomElement = () => {
    const index = getRandomIndex(mutate.length);

    const element = mutate[index];

    mutate.splice(index, 1);

    return element;
  };

  return randomElement;
};
