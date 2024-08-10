// @ts-check

"use strict";

import { getStatsFromMvMember } from "../src/modules/get-number-from-mv-member.js";
import { readFile } from "../src/modules/read.js";

(async () => {
  const usersDataFile = await readFile("output/users.json");

  if (usersDataFile === null) {
    console.error("Error");

    return;
  }

  /**@type {import("../tags.js").UsersDataFromFile} */
  const usersData = JSON.parse(usersDataFile);

  const users = usersData.users;

  for (const [_key, user] of users) {
    console.log(user.mv_member, getStatsFromMvMember(user.mv_member));
  }
})();
