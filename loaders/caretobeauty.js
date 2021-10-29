const page = require('./page')

const makeUrl = (id) => `https://www.caretobeauty.com/en/${id}`

const caretobeauty = async (id) => {
  const url = makeUrl(id)

  const html = await page(url)
  return html
}

module.exports = caretobeauty