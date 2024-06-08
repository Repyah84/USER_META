/**
 *
 * @param {any[]} list
 * @param {(value: any) => Promise<any>} load
 * @param {(value: any) => void} action
 * @returns
 */
export const lazyLoad = (list, load, action) =>
  new Promise((resolve) => {
    let index = 0;

    for (const value of list) {
      load(value).then((r) => {
        action(r);

        index++;

        if (index === list.length) {
          resolve();
        }
      });
    }
  });
