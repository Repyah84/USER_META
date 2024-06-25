// @ts-check

"use strict";

import { getUser } from "./src/api/get-user.js";

setTimeout(async () => {
  try {
    const [userMeta, proxy] = process.argv.slice(2);

    const userMetaResponse = await getUser(userMeta, proxy);

    if (userMetaResponse !== null) {
      process.stdout.write(userMetaResponse);
    }
  } catch {
  } finally {
    process.exit(0);
  }
}, 5000);
