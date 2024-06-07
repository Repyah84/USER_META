/**
 *
 * @param {string} userName
 * @returns {Promise<string | null>}
 */
export const getUser = async (userName) => {
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
      }
    );

    console.log("getUser_response", response.ok);

    if (response.ok) {
      return await response.text();
    }

    return null;
  } catch (error) {
    console.log(error);
  }
};
