const { initDb, readdirAsync, readFileAsync } = require('../lib')
const initMigrator = require('./migrator')
const { isDirectory } = require('../utils')

const db = initDb()

const isMigration = (file) =>
  file &&
  file.length > 8 &&
  file.split('.').length === 2 &&
  file.split('.')[0].length > 3 &&
  Number.parseInt(file.split('.')[0].slice(0, 4), 10) &&
  file.split('.')[1].toLowerCase() === 'sql'

const getMigrations = async (migrationsPath) => {
  const allFiles = await readdirAsync(migrationsPath)
  return allFiles.filter(isMigration).map((file) => `${migrationsPath}/${file}`)
}

const runMigrations = async (migrationsPath) => {
  if (!isDirectory(migrationsPath)) {
    throw new Error(`migrationsPath is not a directory.\n${migrationsPath}`)
  }

  try {
    const migrator = initMigrator(db, readFileAsync)
    const migrations = await getMigrations(migrationsPath)

    await migrator.runAll(migrations)
    return true
  } catch (err) {
    throw err
  } finally {
    await db.disconnect()
  }
}

module.exports = runMigrations
