const { lstatSync } = require("fs");

const isDirectory = (path) => {
  try {
    const result = lstatSync(path);
    return result.isDirectory();
  } catch (err) {
    return false;
  }
};

module.exports = isDirectory;
