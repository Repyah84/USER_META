// @ts-check

"use strict";

import fetch, { AbortError } from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";

/**
 * @param {string} userName
 * @param {string} proxyData
 * @returns {Promise<string | null>}
 */
export const getUser = async (userName, proxyData) => {
  const agent = new HttpsProxyAgent(`http://${proxyData}`);

  const AbortController = globalThis.AbortController;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 7000);

  try {
    const response = await fetch(
      `https://www.manyvids.com/includes/redirect-profile.php?stagename=${userName}&tab=`,
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en,en-US;q=0.9,uk;q=0.8,ru;q=0.7",
          "cache-control": "no-cache",
          pragma: "no-cache",
          priority: "u=0, i",
          "sec-ch-ua":
            '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-site",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          Referer: "https://www.manyvids.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
        agent,
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.text();
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
