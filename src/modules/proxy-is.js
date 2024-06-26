// @ts-check

"use strict";

import fetch, { AbortError } from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";

/**
 * @param {string} proxy
 * @returns {Promise<boolean>}
 */
export const proxyIs = async (proxy) => {
  const agent = new HttpsProxyAgent(`http://${proxy}`);

  const AbortController = globalThis.AbortController;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 30000);

  try {
    await fetch("https://www.manyvids.com/", {
      method: "GET",
      agent,
      signal: controller.signal,
    });

    return true;
  } catch (error) {
    if (error instanceof AbortError) {
      console.log("request was aborted");
    }

    return false;
  } finally {
    clearTimeout(timeout);
  }
};
