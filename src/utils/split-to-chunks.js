/**
 *
 * @param {T[]} array
 * @param {number} chunkSize
 * @returns {T[][]}
 */
export const chunkArray = (array, chunkSize) => {
  var chunks = [];

  for (var i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};
