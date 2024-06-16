// @ts-check

"use strict";

import fetch, { AbortError } from "node-fetch";

/**
 * @param {string | undefined} next
 * @param {string} modalId
 * @returns {Promise<{
 *    success: {
 *      users: { handle: string} []
 *      next: string
 *    }
 * } | null> }
 */
export const getUsers = async (modalId, next) => {
  const AbortController = globalThis.AbortController;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const response = await fetch(
      `https://social-prod.kiwi.manyvids.com/users/${modalId}/followers?userType=MEMBER&next=${next}`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en,en-US;q=0.9,uk;q=0.8,ru;q=0.7",
          authorization: "Bearer guest",
          "cache-control": "no-cache",
          "content-type": "application/json",
          pragma: "no-cache",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          cookie:
            "_hjSessionUser_665482=eyJpZCI6ImVlNTJjMDY0LTdjM2QtNThmNy04NjA5LTliYjJlZmI0ZDRlNSIsImNyZWF0ZWQiOjE3MTIwMDM2NjM3NDIsImV4aXN0aW5nIjp0cnVlfQ==; _gid=GA1.2.594253169.1712263711; timezone=Europe%2FAthens; MSG_LEG_TKN=vv2LrMQY4OZaCHRQOFMNng==; KGID=ea669cd9-4ad8-5dfe-9828-2c1335075662; _ga=GA1.1.1855695697.1712003663; seenWarningPage=eyJpdiI6InE1eEJiRDJycXZRSHNtXC9pM1JFNW1nPT0iLCJ2YWx1ZSI6IlNFWVhaaU1weGJEd0ExMlJtSnhkdUE9PSIsIm1hYyI6ImEwNzFjYmQzNjdkNWNmYWU5N2ZlYzY1YzlmMzMwMTU5NWViNDRkYzg4NDBkMmE5ODVkYWQyNGQyMjQxNzlkYzEifQ%3D%3D; PHPSESSID=6o263om035bgb1512mo3sg804c174gc43aflfksd; XSRF-TOKEN=eyJpdiI6Iks0RG9EbEx1QmhBU0R1eDhxU3Y3d2c9PSIsInZhbHVlIjoiQVhpbThjVmtieHY3UWNyV3k0QVZHQ3prT21NQkQ2aWFIaHJGTFNWMjBPVWUwc0JhNVJ5eU4ySUlUWmJjbzNFQyIsIm1hYyI6IjJjNTk0NzEyZDMwOWYxZWM5YTA5NzBjZDFjOWVmZDE3ODNhMjY4ODZkMTYyNGZjZDI4NDI3ZmQ3ZmE4YWM1NzQifQ%3D%3D; _ga_K93D8HD50B=GS1.1.1717634618.452.1.1717634648.30.0.0; _hjSession_665482=eyJpZCI6ImNhMTIxZjliLWFlNTEtNDJkYS1hNDg4LTk5NGQ1MzkxMGQ0MyIsImMiOjE3MTc2MzQ2NDk5MjIsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=",
          Referer: "https://www.manyvids.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
        signal: controller.signal,
      }
    );

    // @ts-ignore
    return await response.json();
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
