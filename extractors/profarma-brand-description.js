const cheerio = require('cheerio')
const { profarma } = require('../loaders')

const descSelector = '.seodescription-box p'
const parentSelector = 'section'

const brandDescription = async (labId) => {
  const content = await profarma('marca', labId)
  const $ = cheerio.load(content)

  const texts = $(descSelector)
  if(texts.length > 0) {
    let items = []
    let finished = false

    $(texts[0]).parent(parentSelector).children().each((idx, el) => {
      const node = $(el)
      if(node && node.length > 0 && node[0].name === 'p' && !finished) {
        items = [...items, node.text()]
      }
      else {
        finished = true
      }
    })

    return items.join('\n\n')
  }

  console.log(`${filtered.length} ratings for ${searchTerm}`)
  return ''
}

module.exports = brandDescription