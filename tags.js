// @ts-check
///<reference path="./src/types/user.type.js" />
///<reference path="./src/types/model.type.js" />
///<reference path="./src/types/tag.type.js" />

"use strict";

import { addModel } from "./src/store/models.state.js";

import {
  getUserHandle,
  addUserHandle,
} from "./src/store/user-handles.state.js";

import {
  addUserToState,
  getUsersSize,
  getUsersEntries,
} from "./src/store/user.state.js";

import { addTag, getTag } from "./src/store/tags.state.js";
import { UserData } from "./src/models/user.model.js";
import { readFile } from "./src/modules/read.js";
import { chunkArray } from "./src/utils/split-to-chunks.js";
import { addTagsToDataBase } from "./src/modules/add-tags-to-data-base.js";

(async () => {
  try {
    const [indexData] = process.argv.slice(2);

    const index = Number(indexData);

    console.log("USERS_SIZE", getUsersSize(), "INDEX", index);

    const modelsDataFromFile = await readFile("./output/models.txt");
    const usersMetaDataFromFile = await readFile("./output/meta.txt");
    const tagsDataFromFile = await readFile("./output/tags.txt");
    const usersDataFromFile = await readFile("./output/users.txt");

    if (
      modelsDataFromFile === null ||
      usersMetaDataFromFile === null ||
      tagsDataFromFile === null ||
      usersDataFromFile === null
    ) {
      return;
    }

    /**@type {ModelsDataFromFile} */
    const modelsData = JSON.parse(modelsDataFromFile);
    /**@type {TagsDataFromFile} */
    const tagsData = JSON.parse(tagsDataFromFile);
    /**@type {UsersMetaDataFromFile} */
    const userMetaData = JSON.parse(usersMetaDataFromFile);
    /**@type {UsersDataFromFile} */
    const userData = JSON.parse(usersDataFromFile);

    for (const [key, model] of modelsData.models) {
      addModel(key, model);
    }

    for (const [key, tags] of tagsData.tags) {
      addTag(key, tags);
    }

    for (const [key, users] of userMetaData.userHandle) {
      addUserHandle(key, users);
    }

    for (const [
      key,
      { avatar_url, status, userId, username },
    ] of userData.users) {
      addUserToState(key, new UserData(userId, username, status, avatar_url));
    }

    const usersChunks = chunkArray(getUsersEntries(), 5000);

    console.log("LENGTH", usersChunks.length);

    const users = usersChunks[index];

    if (users === undefined) {
      process.stdout.write("[DATA FROM CHILD STOP SESSION]");

      return;
    }

    for (const [key, userData] of users) {
      const modelsId = getUserHandle(key);

      if (modelsId !== undefined) {
        for (const modelId of modelsId) {
          const tags = getTag(modelId);

          if (tags !== undefined) {
            for (const { label } of tags) {
              userData.addTag(label);
            }
          }
        }
      }
    }

    await addTagsToDataBase(users.map(([_key, userData]) => userData));

    console.log("Tags wsa add to data base");
  } catch (error) {
    console.log(`[ERROR FROM CHILD]${error}`);
  } finally {
    process.exit(0);
  }
})();

/**
 * @typedef {Object} UsersDataFromFile
 * @property {[string, User][]} users
 * @property {number} length
 */

/**
 * @typedef {Object} UsersMetaDataFromFile
 * @property {[string, string[]][]} userHandle
 * @property {number} length
 */

/**
 * @typedef {Object} TagsDataFromFile
 * @property {[string, Tag[]][]} tags
 * @property {number} length
 */

/**
 * @typedef {Object} ModelsDataFromFile
 * @property {[string, Model][]} models
 * @property {number} length
 */
