// @ts-check

"use strict";

import { spawn } from "node:child_process";
import EventEmitter from "node:events";

const tagsAddToDateBase = new EventEmitter();

/**@type {number} */
let TAGS_INDEX = 0;

function tagsWorker() {
  const childProcess = spawn("node", ["tags.js", `${TAGS_INDEX}`]);

  childProcess.stdout.on("data", (data) => {
    const dataFromChild = data.toString();

    console.log(dataFromChild);

    if (dataFromChild === "[DATA FROM CHILD STOP SESSION]") {
      console.log("SESSION COMPLETE");

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
  TAGS_INDEX++;

  tagsWorker();
});

tagsWorker();
