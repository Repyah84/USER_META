// cypress.config.js

const fs = require("fs");
const path = require("path");

module.exports = {
  e2e: {
    specPattern: "cypress/**/*.spec.js",
    supportFile: false,
    setupNodeEvents(on, _config) {
      on("task", {
        saveCookies(cookies) {
          const filePath = path.join(__dirname, "output/cookies.txt");

          fs.writeFileSync(filePath, JSON.stringify(cookies, null, 2));

          return null;
        },
      });
    },
  },
};
