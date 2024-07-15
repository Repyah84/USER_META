// @ts-check

"use strict";

import { spawn } from "node:child_process";
import EventEmitter from "node:events";

const tagsAddToDateBase = new EventEmitter();

/**@type {number} */
let INDEX = 0;

/**
 * @param {number} index
 */
function worker(index) {
  const childProcess = spawn("node", ["tags.js", `${index}`]);

  childProcess.stdout.on("data", (data) => {
    const dataFromChild = data.toString();

    console.log(dataFromChild);

    if (dataFromChild === "[DATA FROM CHILD STOP SESSION]") {
      console.log("SESSION COMPLITE");

      process.exit(0);
    }
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`[PARENT] stderr from child: ${data}`);

    tagsAddToDateBase.emit("tags");
  });

  childProcess.on("close", () => {
    tagsAddToDateBase.emit("tags");
  });

  childProcess.on("error", (err) => {
    console.error(`[PARENT] Error spawning child process: ${err}`);

    tagsAddToDateBase.emit("tags");
  });
}

tagsAddToDateBase.on("tags", () => {
  INDEX++;

  worker(INDEX);
});

worker(INDEX);
