import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";

/**
 *
 * @param {string} proxy
 * @returns {Promise<boolean>}
 */
export const proxyIs = async (proxy) => {
  const agent = new HttpsProxyAgent(`http://${proxy}`);

  try {
    await fetch("https://www.google.com/", {
      method: "GET",
      agent,
    });

    return true;
  } catch {
    return false;
  }
};
