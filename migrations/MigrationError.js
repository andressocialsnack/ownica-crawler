function MigrationError(message, errs) {
  this.message = message;
  this.stack = Error().stack;
  this.errs = errs || [];
}

MigrationError.prototype = Object.create(Error.prototype);

MigrationError.prototype.name = "MigrationError";

module.exports = MigrationError;
