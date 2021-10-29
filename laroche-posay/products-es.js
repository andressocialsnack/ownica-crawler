const cheerio = require('cheerio')
const { page } = require('../loaders')
const { toSlug } = require('../slug')

const url = 'https://www.laroche-posay.es/Productos/Categor%c3%adas/Todos-los-productos-de-belleza-ca.aspx'
const brandSelector = '.ctn_range-liste > h2'
const optionsSelector = '.ctn_liste .jQueryScroll a'
const productSelector = '.ctn_product'

const processName = (name) => name.indexOf('La Roche-Posay') > -1 ? name : `La Roche-Posay ${name}`

const toAbsoluteUrl = (url) => {
  const root = 'http://www.laroche-posay.es/'
  const roots = 'https://www.laroche-posay.es/'
  if(!url || typeof(url) !== 'string') {
    return url
  }
  if(!url.startsWith(root) && !url.startsWith(roots)) {
    if(url.startsWith('//')) {
      return `https:${url}`
    }
    if(url.startsWith('/')) {
      return `${roots}${url}`
    }
    return `${roots}/${url}`
  }

  return url
}

;(async () => {
  const html = await page(url)
  const $ = cheerio.load(html)

  const options = $(optionsSelector)
  const need = 'Filter_By need'
  const brand = 'Filter_By range'
  
  let needs = []
  let brands = []

  options.each((idx, el) => {
    const node = $(el)
    const type = node.attr('data-gtmaction')
    const lnk = node.attr('href')
    const txt = node.text().split('(')[0].trim()

    if(type === need) {
      needs = [ ...needs, { lnk, txt } ]
    }

    if(type === brand) {
      brands = [ ...brands, { lnk, txt } ]
    }
  })

  console.log('brands', brands.length)
  console.log('needs', needs.length)  

  const lines = $(brandSelector)
  console.log('lines', lines.length)

  const pdx = $(productSelector)
  let products = []
  pdx.each((idx, el) => {
    const node = $(el)
    const hidden = $(node.children().first())
    if(!hidden) {
      console.log('no hidden', node.html())
      return;
    }
    const style = hidden.attr('style')
    if(!style.toLowerCase().trim() === 'display:none;') {
      console.log('no none', node.html())
      return;
    }

    let name = processName($('span[data-gtm="name"]', hidden).text().trim())
    const primary = $('span[data-gtm="category1"]', hidden).text().trim().split('|')
    const secondary = $('span[data-gtm="category2"]', hidden).text().trim().split('|')
    const categories = [ ...new Set(primary, secondary) ]
    const brand = $('span[data-gtm="brand"]', hidden).text().trim()
    const ratingReviews = $('span[data-gtm="reviews"]', hidden).text().trim()
    const ratingAmount = $('span[data-gtm="rating"]', hidden).text().trim()

    let rating = {}
    if(parseFloat(ratingAmount) !== NaN) {
      rating = {
        corporate: {
          reviews: ratingReviews,
          rating: ratingAmount,
          max: 5
        }      
      }
    }

    const info = $('span.product-title a', node)
    const lnk = toAbsoluteUrl(info.attr('href'))
    const title = info.text().replace(/\*/g, '').replace(/ +/g, ' ')
    let summary = $('span.product-info a', node).text().trim()
    const thumb = toAbsoluteUrl($('figure.v_packshot a img', node).attr('data-lazysizes_src'))

    let size = ''
    if(name.substr(-1) === '*') {
      size = summary
      summary = ''
      name = name.replace(/\*/g, '').replace(/ +/g, ' ')
    }

    const id = toSlug(name)

    products = [ { 
      id, 
      name, 
      title,      
      url,
      lab: 'la-roche-posay',
      brand,
      classifications: {
        corporate: categories
      }, 
      texts: { 
        list: { 
          title,
          summary: summary || '' 
        } 
      },
      imgs: {
        site: {
          thumb: thumb || ''
        } 
      },
      info: {
        presentations: size ? [ size ] : []
      },
      ratings: rating,
      ingredients: {}
    }, ...products]
  
  })  
})()