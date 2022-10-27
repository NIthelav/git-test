const axios = require("axios");
const { createCommitHistory } = require("./createCommitHistory");

const formater = new Intl.DateTimeFormat("en-US");

const OAuth = process.env.TOKEN;
const pusherName = process.env.ACTOR;
const tagName = process.env.TAG_NAME;

const commitHistory = createCommitHistory(tagName);
const description = `Ответственный за релиз - ${pusherName}\n\n\n---\n\n\nКоммиты попавшие в релиз:`;

axios.patch(
  "https://api.tracker.yandex.net/v2/issues/HOMEWORKSHRI-158",
  {
    summary: `Релиз ${tagName} - ${formater.format(new Date())}`,
    description: commitHistory.reduce(
      (acc, cur) => `${acc}\n${cur}`,
      description
    ),
  },
  {
    headers: {
      Authorization: `OAuth ${OAuth}`,
      "X-Org-ID": 7526988,
    },
  }
);
