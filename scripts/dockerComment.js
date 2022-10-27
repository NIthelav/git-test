const axios = require("axios");
const exec = require("util").promisify(require("child_process").exec);

const OAuth = process.env.TOKEN;
const tagName = process.env.TAG_NAME;

process.env.axios.post(
  "https://api.tracker.yandex.net/v2/issues/HOMEWORKSHRI-158/comments",
  {
    text: `Собрали образ в тегом ${tagName}`,
  },
  {
    headers: {
      Authorization: `OAuth ${OAuth}`,
      "X-Org-ID": 7526988,
    },
  }
);
