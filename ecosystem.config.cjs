module.exports = {
  apps: [
    {
      name: "users",
      script: "./server.js",
      stop_exit_codes: [0],
      exec_mode: "cluster",
      cron_restart: "0 0 * * 0",
      max_memory_restart: "4G",
    },
  ],
};
