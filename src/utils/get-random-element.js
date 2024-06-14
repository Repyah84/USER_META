/**
 *
 * @param {T[]} elements
 * @returns {fn() => T}
 */
export const getRandomElement = (elements) => {
  const mutate = [...elements];

  const getRandomIndex = (number) => Math.floor(Math.random() * (number + 1));

  const randomElement = () => {
    const index = getRandomIndex(mutate.length);

    const element = mutate[index];

    console.log("ELEMENT___", element);

    mutate.splice(index, 1);

    console.log("PROXY___", mutate.length);

    return element;
  };

  return randomElement;
};
