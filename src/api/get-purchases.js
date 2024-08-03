// @ts-check

"use strict";

import { HttpsProxyAgent } from "https-proxy-agent";
import fetch, { AbortError } from "node-fetch";

/**
 * @param {string} userId
 * @param {string} userName
 * @param {string} cookie
 * @param {string} proxyData
 * @returns {Promise<string | null>}
 */
export const getPurchases = async (userId, userName, cookie, proxyData) => {
  const agent = new HttpsProxyAgent(`http://${proxyData}`);

  const AbortController = globalThis.AbortController;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(
      `https://www.manyvids.com/Profile/${userId}/${userName}/Purchases/`,
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en,en-US;q=0.9,uk;q=0.8,ru;q=0.7",
          "cache-control": "no-cache",
          pragma: "no-cache",
          priority: "u=0, i",
          "sec-ch-ua":
            '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          cookie,
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        signal: controller.signal,
        agent,
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.text();

    return data;
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
