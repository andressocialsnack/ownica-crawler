const cheerio = require('cheerio')
const { caretobeauty } = require('../loaders')

const descSelector = '.category-description'

const brandDescription = async (labId) => {
  const content = await caretobeauty(labId)
  const $ = cheerio.load(content)

  const texts = $(descSelector).children()
  let items = []
  let finished = false

  texts.each((idx, el) => {
    const node = $(el)
    if(node && node.length > 0 && node[0].name === 'p' && !finished) {
      items = [...items, node.text()]
    }
    else {
      finished = true
    }    
  })

  if(items.length > 0) {
    return items.join('\n\n')    
  }    

  console.log(`${filtered.length} ratings for ${searchTerm}`)
  return ''
}

module.exports = brandDescription