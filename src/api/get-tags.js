// @ts-check
/// <reference path="../types/tag.type.js" />

"use strict";

import { HttpsProxyAgent } from "https-proxy-agent";
import fetch, { AbortError } from "node-fetch";

/**
 * @param {string} modalIdShort
 * @param {string} proxyData
 * @returns {Promise<{data: Tag[]} | null>}
 */
export const getTags = async (modalIdShort, proxyData) => {
  const agent = new HttpsProxyAgent(`http://${proxyData}`);

  const AbortController = globalThis.AbortController;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(
      `https://www.manyvids.com/bff/store/videos/${modalIdShort}/tags`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en,en-US;q=0.9,uk;q=0.8,ru;q=0.7",
          "cache-control": "no-cache",
          pragma: "no-cache",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          Referer: `https://www.manyvids.com/Profile/${modalIdShort}/rheasweet/Store/Videos`,
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
        signal: controller.signal,
        agent,
      }
    );

    if (!response.ok) {
      return null;
    }

    return await /** @type {Promise<{data: Tag[]}>} */ (response.json());
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
