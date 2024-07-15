// @ts-check

"use strict";

import { spawn } from "node:child_process";
import EventEmitter from "node:events";

(() => {
  /**@type {number} */
  const INDEX = 0;

  const tagsAddToDateBase = new EventEmitter();

  function worker() {
    const childProcess = spawn("node", ["tags.js", `${INDEX}`]);

    childProcess.stdout.on("data", (data) => {
      const dataFromChild = data.toString();

      console.log(dataFromChild);
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
})();
