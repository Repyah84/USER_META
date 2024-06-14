import { getUsers } from "../../api/get-users.js";

/**
 *
 * @param {string} modalId
 * @param {string | undefined} next
 * @param {number | undefined} limit
 * @returns {Promise<string[]>}
 */
export const users = async (modalId, next, limit) => {
  const usersHandles = [];

  const usersResponse = await getUsers(modalId, next);

  if (usersResponse?.success?.users) {
    usersResponse.success.users.forEach((user) => {
      if (user.handle) {
        console.log("USER_HANDLE", user.handle);

        usersHandles.push(user.handle);
      }
    });
  }

  if (limit && usersHandles.length >= limit) {
    return usersHandles;
  }

  if (usersResponse?.success?.next) {
    await users(modalId, usersResponse.success.next, limit);
  } else {
    return usersHandles;
  }
};
