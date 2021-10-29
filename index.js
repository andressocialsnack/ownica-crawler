const { join } = require("path");
const { initDb } = require('./lib')
const { create } = require('./labs')
// const unique = require('./utils/unique')
// const { runMigrations } = require("./migrations");

// const db = initDb()

// const all = (collection) => db[collection].findMany()
// const create = (collection, id, item) => db[collection].create({ data: item })
// const update = (collection, id, data) => db[collection].update({
//   where: { id },
//   data
// })

const arr1 = [ 3, 5, 7]
const arr2 = [ 5, 6, 7]

//console.log([...arr1, ...arr2].unique().sort())

// ;(async () => {
//   try {
//     const base = process.cwd();
//     const path = join(base, "migrations");

//     const result = await runMigrations(path);
//     console.log("result", result);

//     const db = initDb()
//     const dbResult = await create(db)

//     console.log('result', dbResult)

//   } catch (err) {
//     throw err;
//   }
// })();


