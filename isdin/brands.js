const cheerio = require('cheerio')

const { meta } = require('../extractors')
const { page } = require('../loaders')
const { toSlug } = require('../slug')
const { contains } = require('../utils')

const selector = 'div#menu-item-nuestras-marcas ul li a'

const enUrl = 'https://www.isdin.com/en'
const esUrl = 'http://www.isdin.com/'

const getBrandDescription = async(url) => {
  let desc = ''  
  
  try {
    const html = await page(url)
    const $ = cheerio.load(html)

    desc = meta($)
  }
  catch{ }

  return desc
}

const withText = async(brands) => {
  const results = 
}

const getBrandList = async (url, locale) => {
  const html = await page(url)
  const $ = cheerio.load(html)

  const menus = $(selector)

  let brands = []
  menus.each((idx, el) => {
    const href = `https:${$(el).attr('href')}`
    const name = $(el).text()
    const id = toSlug(name)

    const brand = {
      id,
      name,
      locale,
      urls: {
        corporate: href
      }
      texts: {
        official: ''
      },
      markets: {},
      data: {}
    }

    brands = [ brand, ...brands ]
  })

  return brands
}

const getBrands = async () => {
  const en = await getBrandList()
  const es = await getBrandList()
  const enWithText = await Promise.all(
    en.map(async() => {
      const texts = {
        official: {
          en: '',
          es: ''
        }
      }

      let enDesc = ''
      let esDesc = ''
      if(map.es && map.en) {
        enDesc = await getBrandDescription(en.find(x => x.id === map.en))
        esDesc = await getBrandDescription(es.find(x => x.id === map.es))
      }
      else if(map.es) {
        esDesc = await getBrandDescription(es.find(x => x.id === map.es))
      }
      else {
        enDesc = await getBrandDescription(en.find(x => x.id === map.en))
      }

      let products = 

      const 
      // const brand = {
      //   id,
      //   name,
      //   lab_id: 'isdin',
      //   data: {},
      //   urls: {
      //     'corporate': {
      //       'es': href
      //     }
      //   },
      //   markets: { },
      //   texts: { }
      // }

      const desc = await getBrandExplination(href)
      // const texts = {
      //   official: {
      //     es: desc
      //   }
      // }

      // brand.texts = texts
      // return brand
      return { id, name }
    })
  )

  const en = await getBrandList(enUrl)
  const enWithText = await Promise.all(
    en.map(async({id, name, href}) => {
      // if(contains(masterList, (b) => b.id === id) {
        const desc = await getBrandExplination(href)
        return { id, name }
      // }
    })
  )
  console.log('brandsWithText', brandsWithText)
  console.log('enWithText', enWithText)
  return brandsWithText
}

;(async() => {
  const brands = await getBrands()
  console.log('brands', brands)
})()