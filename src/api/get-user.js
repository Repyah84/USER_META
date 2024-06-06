/**
 *
 * @param {string} userName
 * @returns {Promise<string>}
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
          cookie:
            "_hjSessionUser_665482=eyJpZCI6ImVlNTJjMDY0LTdjM2QtNThmNy04NjA5LTliYjJlZmI0ZDRlNSIsImNyZWF0ZWQiOjE3MTIwMDM2NjM3NDIsImV4aXN0aW5nIjp0cnVlfQ==; _gid=GA1.2.594253169.1712263711; timezone=Europe%2FAthens; dataSectionTemp=0; fp_token_7c6a6574-f011-4c9a-abdd-9894a102ccef=Z80maGQO19CnLkio/qTwGTVF9emV5NOERn4tba09cT0=; _ga=GA1.1.1855695697.1712003663; privacyPolicyRead=1; PHPSESSID=lemi2hm0mogq8bq5r7d5kqj9ht3v1u78aklll9ah; MSG_LEG_TKN=vv2LrMQY4OZaCHRQOFMNng==; mvAnnouncement=ToK0OXK4Dr8R%3AKTkm3l2QDXbl%3ATovxD1sOyARR%3AWF1v6VaZSbXN%3Aot1sqolFs0S3%3Af32kgy8zum20%3Ao6lJ2pISBWha%3A817U4v7dVTM8%3A5UIyQi765tUB; userPreferredContent=1p; contentPopup=false; KGID=ea669cd9-4ad8-5dfe-9828-2c1335075662; _hjSession_665482=eyJpZCI6IjhlZjk0MGQxLTkwZTEtNDEzMi05NmE1LTM2NDgwNGE2NjZmNyIsImMiOjE3MTc2MDg2NjcyNDYsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; _gid=GA1.1.594253169.1712263711; _ga=GA1.1.1855695697.1712003663; XSRF-TOKEN=eyJpdiI6IkxxV0VoamtwOVQ4NVNCNXZqclQ0dlE9PSIsInZhbHVlIjoiaktOQXlzM09iSVd3enNOcWV2THVCdnh2KzdnUGM1MFRhSlRGY1JoUFJNTlwvV2xEY0FTY0xQdVVWUHp4U3diYVIiLCJtYWMiOiJmZTEwNTYyYzhkMGVmOTQzZWM5ZGNlNjdmMTc5N2I0YmNlOTBlMGYxZmZiYWYyOTM1MWNiMmQwNmNjMDgyY2ZkIn0%3D; AWSALB=RnXHOJqdWzOQFWhcGu2CdnjL2JnA4SNd5meU6rN20BC/d0MhlehgGwVqnlsV7pqxrRWqKY0d1g8aJ+gJaIC5gj96vNIMBm8LWAztnd7dZ3Eb/LdU9TDDlcdCs45lSgXnKsn2Z7AuoeTh1z6KUylGaW85E5HhiOKc3mBkb0TPu5y0EaNpbuZZR2sdEmiwoA==; AWSALBCORS=RnXHOJqdWzOQFWhcGu2CdnjL2JnA4SNd5meU6rN20BC/d0MhlehgGwVqnlsV7pqxrRWqKY0d1g8aJ+gJaIC5gj96vNIMBm8LWAztnd7dZ3Eb/LdU9TDDlcdCs45lSgXnKsn2Z7AuoeTh1z6KUylGaW85E5HhiOKc3mBkb0TPu5y0EaNpbuZZR2sdEmiwoA==; _gat=1; _ga_K93D8HD50B=GS1.1.1717608665.449.1.1717611911.50.0.0; _dd_s=logs=1&id=f77e4263-c380-4ddc-acb0-08b29b31e555&created=1717608665643&expire=1717612851389",
          Referer: "https://www.manyvids.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );

    const data = await response.text();

    return data;
  } catch (error) {
    console.log(error);
  }
};
