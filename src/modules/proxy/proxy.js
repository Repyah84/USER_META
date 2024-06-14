import { proxyIs } from "../../utils/proxy-is.js";

/**
 *
 * @param {string[]} proxyData
 * @returns {Promise<[string[], string[]]>}
 */
export const initProxy = async (proxyList) => {
  const proxyMeta = [];
  const proxyRotten = [];

  for (const meta of proxyList) {
    const res = await proxyIs(meta);

    console.log(res);

    if (res) {
      proxyMeta.push(meta);
    } else {
      proxyRotten.push(meta);
    }
  }

  return [proxyMeta, proxyRotten];
};
