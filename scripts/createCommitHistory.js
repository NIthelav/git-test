const { execSync } = require("child_process");

const sc = (str, s) => str.split(s).filter(Boolean);

const stdout = execSync('git log --pretty="%h|%an|%ae|%s|%d" --decorate', {
  encoding: "utf-8",
});

console.log(stdout);

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

const createCommitHistory = (lastTagName) => {
  const getTagName = (tags) => tags.match(/rc-\d+\.\d+\.\d+/)?.[0];

  const tagBefore =
    lastTagName.replace(/(rc-\d+\.\d+\.)\d+/, "$1") +
    (lastTagName.replace(/rc-\d+\.\d+\.(\d+)/, "$1") - 1);
  let isOver = false;

  return commits.order.reduce((acc, cur) => {
    if (isOver) return acc;

    const hashData = commits.data[cur];
    const nextTagName = getTagName(hashData.tags || "");

    if (!nextTagName || nextTagName !== tagBefore) {
      return acc.concat(
        `${hashData.hash}: ${hashData.login}-${hashData.title}`
      );
    }
    isOver = true;
    return acc;
  }, []);
};

module.exports = { createCommitHistory };
