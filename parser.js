// @ts-check
/// <reference path="./src/types/user.type.js"/>

"use strict";

import { getPurchases } from "./src/api/get-purchases.js";
import { getUser } from "./src/api/get-user.js";
import { getMvMember } from "./src/modules/get-mv-member.js";
import { readFile } from "./src/modules/read.js";
import { findUserMeta } from "./src/utils/find-user-meta.js";
import { formatCookies } from "./src/utils/format-cookies.js";
import { getUserMeta } from "./src/utils/get-user-model.js";
import { serializeString } from "./src/utils/serialize-str.js";

setTimeout(async () => {
  try {
    const [userMeta, proxy] = process.argv.slice(2);

    const userMetaResponse = await getUser(userMeta, proxy);

    if (!userMetaResponse) {
      return;
    }

    const meta = findUserMeta(userMetaResponse);

    const cookies = await readFile("./output/cookies.json");

    if (meta === null || cookies === null) {
      return;
    }

    /** @type {User} */
    const user = getUserMeta(meta);

    const purchases = await getPurchases(
      user.userId,
      user.username,
      formatCookies(JSON.parse(cookies)),
      proxy
    );

    if (purchases === null) {
      return;
    }

    const mv_member = getMvMember(serializeString(purchases)) || "";

    process.stdout.write(
      `[DATA FROM CHILD]${JSON.stringify({ ...user, mv_member })}`
    );
  } catch (error) {
    console.log(`[ERROR FROM CHILD]${error}`);
  } finally {
    process.exit(0);
  }
}, 1000);
