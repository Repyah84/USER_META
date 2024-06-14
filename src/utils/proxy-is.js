import fetch, { AbortError } from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";

/**
 *
 * @param {string} proxy
 * @returns {Promise<boolean>}
 */
export const proxyIs = async (proxy) => {
  const agent = new HttpsProxyAgent(`http://${proxy}`);

  const AbortController = globalThis.AbortController;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 60000);

  try {
    await fetch("https://www.google.com/", {
      method: "GET",
      agent,
      signal: controller.signal,
    });

    return true;
  } catch {
    if (error instanceof AbortError) {
      console.log("request was aborted");
    }

    return false;
  } finally {
    clearTimeout(timeout);
  }
};
