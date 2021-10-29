const { readdir } = require("fs");
const { promisify } = require("util");

const readdirAsync = promisify(readdir);

module.exports = readdirAsync;
