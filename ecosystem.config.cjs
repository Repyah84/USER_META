module.exports = {
  apps: [
    {
      name: "users",
      script: "./server.js",
      exec_mode: "cluster",
      // instances: "max",

      // cron_restart: "*/2 * * * *",
    },
  ],
};
