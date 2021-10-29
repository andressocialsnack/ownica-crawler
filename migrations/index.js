const MigrationError = require("./MigrationError");
const init = require("./migrator");
const runMigrations = require("./runMigrations");

module.exports = {
  init,
  MigrationError,
  migrator: {
    init,
  },
  runMigrations,
};
