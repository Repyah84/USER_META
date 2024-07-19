// @ts-check

"use strict";

export class UserData {
  /** @type {Set<string>} */
  tags;
  /** @type {string} */
  userId;
  /** @type {string} */
  username;
  /** @type {string} */
  status;
  /** @type {string} */
  avatar_url;

  /**
   * @param {string} userId
   * @param {string} username
   * @param {string} status
   * @param {string} avatar_url
   */
  constructor(userId, username, status, avatar_url) {
    this.tags = new Set();

    this.avatar_url = avatar_url;
    this.status = status;
    this.userId = userId;
    this.username = username;
  }

  /**
   * @param {string} tag
   * @returns {void}
   */
  addTag(tag) {
    this.tags.add(tag);
  }

  /**
   * @returns {Array<string>}
   */
  getTags() {
    return Array.from(this.tags.values());
  }

  /**
   * @returns {User}
   */
  getUserData() {
    return {
      avatar_url: this.avatar_url,
      status: this.status,
      userId: this.userId,
      username: this.username,
    };
  }
}
