const { contains, isError, withError } = require("../utils");
const MigrationError = require("./MigrationError");

const isDb = (db) => db && db.executeRaw && typeof db.executeRaw === "function";
const isReadFile = (fn) => fn && typeof fn === "function";

const run = (db, readFileAsync) => async (migration) => {
  const sql = await readFileAsync(migration, "utf-8");
  const queries = sql.split(";");
  const result = await Promise.all(
    queries.map(async (query) => await db.executeRaw(query))
  );
  return result;
};

const runAll = (db, readFileAsync) => async (migrations) => {
  const fn = (m) => withError(run(db, readFileAsync), m);
  const result = await Promise.all(migrations.map(async (m) => await fn(m)));
  const where = (item) => isError(item);
  if (contains(result, where)) {
    const errs = result.filter(isError);
    throw new MigrationError("Migration errors", errs);
  }

  return result;
};

const init = (db, readFileAsync) => {
  if (!isDb(db)) {
    throw new Error("db invalid");
  }

  if (!isReadFile(readFileAsync)) {
    throw new Error("readFileAsync invalid");
  }

  return {
    run: run(db, readFileAsync),
    runAll: runAll(db, readFileAsync),
  };
};

module.exports = init;
