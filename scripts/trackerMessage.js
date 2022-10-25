const axios = require("axios");

if (!process.env.TOKEN) throw new Error("Нужно указать clientId");

const OAuth = process.env.TOKEN;
const tagName = process.env.TAGNAME;

console.log(`OAuth ${OAuth}`);

console.log(process.env);

// const formater = new Intl.DateTimeFormat("en-US");

// axios
//   .patch(
//     "https://api.tracker.yandex.net/v2/issues/HOMEWORKSHRI-158",
//     {
//       summary: `Релиз ${tagName} - ${formater.format(new Date())}`,
//       description: "Новое описание задачи",
//     },
//     {
//       headers: {
//         Authorization: `OAuth ${OAuth}`,
//         "X-Org-ID": 7526988,
//       },
//     }
//   );

// PATCH /v2/issues/<issue-id>
// Host: https://api.tracker.yandex.net
// Authorization: OAuth <OAuth-токен>
// X-Org-ID: <идентификатор организации>
// {
//    Тело запроса в формате JSON
// }

// axios
//   .get("https://api.tracker.yandex.net/v2/myself", {
//     headers: {
//       Authorization: `OAuth ${OAuth}`,
//       "X-Org-ID": 7526988,
//     },
//   })
//   .then(console.log);
