// @ts-check

"use strict";

/**
 * @param {number} ms
 * @returns
 */
export const formatMilliseconds = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  const formattedDays = String(days).padStart(2, "0");
  const formattedHours = String(remainingHours).padStart(2, "0");
  const formattedMinutes = String(remainingMinutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedDays}:${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
