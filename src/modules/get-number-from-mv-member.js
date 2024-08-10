// @ts-check

"use strict";

/**
 * @param {string} value
 * @returns {string}
 */
const parsRest = (value) => {
  let rest = "";

  if (value.includes("K")) {
    const str = value.split("K")[0];

    const order = 3 - str.length;

    rest = str + "0".repeat(order);
  }

  if (value.includes("M")) {
    const str = value.split("M")[0];

    const order = 6 - str.length;

    rest = str + "0".repeat(order);
  }

  return rest;
};

/**
 * @param {string} value
 * @returns {number}
 */
export const getStatsFromMvMember = (value) => {
  if (!value || value === "-") {
    return 0;
  }

  if (value.includes(".")) {
    const parts = value.split(".");

    return Number(parts[0] + parsRest(parts[1]));
  }

  if (value.includes("K")) {
    const parts = value.split("K");

    return Number(parts[0]) * 1000;
  }

  if (value.includes("M")) {
    const parts = value.split("M");

    return Number(parts[0]) * 1000000;
  }

  return Number(value);
};
