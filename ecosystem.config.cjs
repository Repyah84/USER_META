module.exports = {
  apps: [
    {
      name: "users",
      script: "./server.js",
      exec_mode: "cluster",
      // cron_restart: "*/2 * * * *",
    },
  ],
};
