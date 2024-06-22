// @ts-check

"use strict";

import { getUser } from "./src/api/get-user.js";
import { findUserMeta } from "./src/utils/find-user-meta.js";

setTimeout(async () => {
  const [userMeta, proxy] = process.argv.slice(2);

  const userMetaResponse = await getUser(userMeta, proxy);

  if (userMetaResponse !== null) {
    const meta = findUserMeta(userMetaResponse);

    if (meta !== null) {
      process.stdout.write(meta);
    }
  }

  process.exit(0);
}, 2000);
