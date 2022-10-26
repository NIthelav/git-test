const axios = require("axios");
const exec = require("util").promisify(require("child_process").exec);

const sc = (str, s) => str.split(s).filter(Boolean);

const getTagName = (tags) => tags.match(/rc-[0-9].[0-9].[0-9]/)?.[0];

const createCommitHistory = (commits, lastTagName) => {
  const tagBefore = lastTagName.slice(0, -1) + (lastTagName.slice(-1) - 1);
  let isOver = false;

  return commits.order.reduce((acc, cur) => {
    if (isOver) return acc;

    const hashData = commits.data[cur];
    const nextTagName = getTagName(hashData.tags);

    if (!nextTagName || nextTagName !== tagBefore) {
      return acc.concat(`${hashData.login}-${hashData.title}`);
    }
    isOver = true;
    return acc;
  }, []);
};

const OAuth = process.env.TOKEN;

(async () => {
  const { stdout } = await exec(
    'git log --pretty="%h|%an|%ae|%s|%d" --decorate'
  );

  const rawCommits = sc(stdout, "\n").map((e) => sc(e, "|"));

  const commits = {
    order: rawCommits.map(([hash]) => hash),
    data: rawCommits.reduce(
      (acc, [hash, login, email, title, tags]) => (
        (acc[hash] = {
          hash,
          login,
          email,
          title,
          tags: tags?.replace(/.*tag: ([a-zA-Z0-9\.-]+),.*/, "$1"),
        }),
        acc
      ),
      {}
    ),
  };

  const tagName = getTagName(commits.data[commits.order[0]].tags);
  const commitHistory = createCommitHistory(commits, tagName);
  const formater = new Intl.DateTimeFormat("en-US");

  axios.patch(
    "https://api.tracker.yandex.net/v2/issues/HOMEWORKSHRI-158",
    {
      summary: `Релиз ${tagName} - ${formater.format(new Date())}`,
      description: commitHistory.reduce((acc, cur) => `${acc}\n${cur}`, ""),
    },
    {
      headers: {
        Authorization: `OAuth ${OAuth}`,
        "X-Org-ID": 7526988,
      },
    }
  );
})();

// console.log(`OAuth ${OAuth}`);

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

// axios
//   .get("https://api.tracker.yandex.net/v2/myself", {
//     headers: {
//       Authorization: `OAuth ${OAuth}`,
//       "X-Org-ID": 7526988,
//     },
//   })
//   .then(console.log);
//
