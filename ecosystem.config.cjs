module.exports = {
  apps: [
    {
      name: "users",
      script: "./server.js",
      exec_mode: "cluster",
    },
  ],

  deploy: {
    production: {
      user: "ubuntu",
      host: ["95.217.124.99"],
      ref: "origin/master",
      repo: "github.com/Repyah84/USER_META.git",
      path: "/root/server/USER_META",
      "post-deploy": "npm install",
    },
  },
};
