/**
 *
 * @param {string} next
 * @returns {Promise<{
 *    success: {
 *      users: { handle: string} []
 *      next: string
 *    }
 * }>}
 */
export const getUsers = async (next) => {
  try {
    const response = await fetch(
      `https://social-prod.kiwi.manyvids.com/users/94aace8d-a2bf-550f-9946-b1b1abd33e83/followers?userType=MEMBER&next=${next}`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en,en-US;q=0.9,uk;q=0.8,ru;q=0.7",
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
            "_hjSessionUser_665482=eyJpZCI6ImVlNTJjMDY0LTdjM2QtNThmNy04NjA5LTliYjJlZmI0ZDRlNSIsImNyZWF0ZWQiOjE3MTIwMDM2NjM3NDIsImV4aXN0aW5nIjp0cnVlfQ==; _gid=GA1.2.594253169.1712263711; timezone=Europe%2FAthens; PHPSESSID=lemi2hm0mogq8bq5r7d5kqj9ht3v1u78aklll9ah; MSG_LEG_TKN=vv2LrMQY4OZaCHRQOFMNng==; KGID=ea669cd9-4ad8-5dfe-9828-2c1335075662; _hjSession_665482=eyJpZCI6IjhlZjk0MGQxLTkwZTEtNDEzMi05NmE1LTM2NDgwNGE2NjZmNyIsImMiOjE3MTc2MDg2NjcyNDYsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; _ga=GA1.1.1855695697.1712003663; XSRF-TOKEN=eyJpdiI6IjI0ZllNQjhvaE5yQ3JSUHFKTEtkdmc9PSIsInZhbHVlIjoiU2h4K29Id3Rzc0o1NjBjM251WW1QMVdveDV3a1M1S3VvVWZHRVRvOE1RcDNkMFo4aTRlQnllblwvWTZrME83b3ciLCJtYWMiOiJlYWEyY2FlYzQ5ZDk1NzgyNWY2N2M2YWYzOTg0ZDY0NWQxYzczNzkzNjhjZDhkMTk0ZWRiN2I0ZjQ0NDk5MzhkIn0%3D; _ga_K93D8HD50B=GS1.1.1717608665.449.1.1717609492.59.0.0",
          Referer: "https://www.manyvids.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
