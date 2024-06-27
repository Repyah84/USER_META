// @ts-check

"use strict";

import { getUser } from "./src/api/get-user.js";
import { findUserMeta } from "./src/utils/find-user-meta.js";

setTimeout(async () => {
  try {
    const [userMeta, proxy] = process.argv.slice(2);

    const userMetaResponse = await getUser(userMeta, proxy);

    if (!userMetaResponse) {
      return;
    }

    const meta = findUserMeta(userMetaResponse);

    if (meta === null) {
      return;
    }

    process.stdout.write(`[DATA FROM CHILD]${meta}`);
  } catch (error) {
    console.log(`[ERROR FROM CHILD]${error}`);
  } finally {
    process.exit(0);
  }
}, 1000);
