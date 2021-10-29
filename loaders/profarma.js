const page = require('./page')

const makeUrl = (section, id) => `https://www.promofarma.com/${section}/${id}`

const profarma = async (section, id) => {
  const url = makeUrl(section, id)

  const html = await page(url)
  return html
}

module.exports = profarma