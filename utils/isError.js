const isError = (e) =>
  e &&
  e.stack &&
  e.message &&
  typeof e.stack === "string" &&
  typeof e.message === "string";

module.exports = isError;
