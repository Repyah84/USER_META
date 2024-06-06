import express from "express";
import cors from "cors";
import path from "path";

import { fileURLToPath } from "url";
import { getUsers } from "./src/api/get-users.js";
import { getUser } from "./src/api/get-user.js";
import { findUserMeta } from "./src/utils/find-user-meta.js";
import { save } from "./src/utils/save.js";
import { formatMilliseconds } from "./src/utils/time.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_LENGTH = 50;

const usersHandles = [];
const usersMeta = [];

let start = 0;
let end = 0;

const initUserPars = async () => {
  start = Date.now();

  await users();

  console.log("GET_USERS_META");

  for (const userHandle of usersHandles) {
    const userMetaResponse = await getUser(userHandle);

    const meta = findUserMeta(userMetaResponse);

    if (meta !== null) {
      console.log("GET_USER_META", meta);
      usersMeta.push(meta);
    }
  }

  end = Date.now();

  console.log("usersHandles", usersHandles.length);
  console.log("usersMeta", usersMeta.length);
  console.log("SPEND_TIME", formatMilliseconds(end - start));

  save(
    `${JSON.stringify(usersMeta)}Time:${formatMilliseconds(end - start)}`,
    path.join(__dirname, "users.txt")
  );
};

/**
 *
 * @param {string | undefined} next
 */
const users = async (next) => {
  const usersResponse = await getUsers(next);

  if (usersResponse?.success?.users) {
    usersResponse.success.users.forEach((user) => {
      console.log(user.handle);

      usersHandles.push(user.handle);
    });
  }

  if (usersHandles.length >= MAX_LENGTH) {
    return;
  }

  if (usersResponse?.success?.next) {
    await users(usersResponse.success.next);
  }
};

const app = express();

app.use(cors());

app.listen(1000, () => {
  console.log("Server Works !!! At port 1000");
});

initUserPars();
