// @ts-check
/// <reference path="../types/model.type.js" />

"use strict";

import fetch, { AbortError } from "node-fetch";

import { SIZE } from "../const/size.js";
import { HttpsProxyAgent } from "https-proxy-agent";

/**
 * @typedef {{
 *      creators: Model[],
 *      currentPage: number
 *      totalPages: number
 * }} ResponseData
 * @param {number} page
 * @param {string} proxyData
 * @returns {Promise<ResponseData| null>}
 */
export const getModels = async (page, proxyData) => {
  const agent = new HttpsProxyAgent(`http://${proxyData}`);

  const AbortController = globalThis.AbortController;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(
      `https://www.manyvids.com/bff/search/creators/list?sort=followers&contentPref=1%252C2%252C3&contentType=1&from=${
        SIZE * page
      }&size=${SIZE}`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en,en-US;q=0.9,uk;q=0.8,ru;q=0.7",
          "cache-control": "no-cache",
          pragma: "no-cache",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          Referer: "https://www.manyvids.com/creators/women",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
        agent,
      }
    );

    if (!response.ok) {
      return null;
    }

    return await /** @type {Promise<ResponseData>} */ (response.json());
  } catch (error) {
    if (error instanceof AbortError) {
      console.log("request was aborted");
    } else {
      console.log(error);
    }

    return null;
  } finally {
    clearTimeout(timeout);
  }
};
