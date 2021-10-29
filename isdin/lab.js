const cheerio = require('cheerio')
const { page } = require('../loaders')
const { googleRating, labDescription, meta } = require('../extractors')

const isdin = () => ({
  id: 'isdin',
  name: 'ISDIN',
  data: {},
  urls: {
    corporate: {
      en: 'https://www.isdin.com/en',
      es: 'https://www.isdin.com/',
      mx: 'https://www.isdin.com/es-MX'      
    }
  },
  ratings: {},
  texts: {}
})

const extractDescriptions = async (isdin) => {
  const links = Object.getOwnPropertyNames(isdin.urls.corporate)
    .map(x => [ x, isdin.urls.corporate[x] ])      

  const extracted = await Promise.all(links.map(async (lk) => {
    const [ lang, url ] = lk

    const html = await page(url)
    const $ = cheerio.load(html)
    return [ lang, meta($) ]
  }))

  return extracted.reduce((agg, item) => {
    const [lang, desc] = item
    agg[lang] = desc
    return agg
  }, {})
}



const create = async () => {
  const lab = isdin()
  const official = await extractDescriptions(lab)
  const external = await labDescription(lab.id)
  const rating = await googleRating(lab.id)

  lab.texts.official = official
  lab.texts.external = external
  lab.ratings.google = rating

  return lab
}

module.exports = create