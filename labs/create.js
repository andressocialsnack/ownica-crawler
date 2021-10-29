const initStore = require('./store')
const { lab: isdin } = require('../isdin')

const create = async (db) => {
  const { create } = initStore(db)
  const lab = await isdin()

  const result = await create(lab)
}

module.exports = create