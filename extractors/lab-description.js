const ctb = require('./caretobeauty-brand-description')
const pf = require('./profarma-brand-description')

const labDescription = async(labId) => {
  const en = await ctb(labId)
  const es = await pf(labId)

  return ({
    en,
    es
  })
}

module.exports = labDescription