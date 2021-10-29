const cheerio = require('cheerio')
const { initDb } = require('../lib')
const { page } = require('../loaders')
const { toSlug } = require('../slug')
const { flatten } = require('../utils')

const url = 'https://www.isdin.com/producto'
const treatmentSelector = 'ul.son-menu-piel li a'
const brandSelector = 'ul.son-menu-marca li a'
const productSelector = 'div.product-list div.item'

const allTreatments = async () => {
  const html = await page(url)
  const $ = cheerio.load(html)

  const nodes = $(treatmentSelector)
  let treatments = []  
  nodes.each((idx, el) => {
    const node = $(el)
    const href = `https://www.isdin.com${node.attr('href')}`
    const name = node.text()
    const id = toSlug(name)

    treatments = [ { id, name, href }, ...treatments]
  })

  return treatments
}

const allBrands = async () => {
  const html = await page(url)
  const $ = cheerio.load(html)

  const nodes = $(brandSelector)
  let brands = []  
  nodes.each((idx, el) => {
    const node = $(el)
    const href = `https://www.isdin.com${node.attr('href')}`
    const name = node.text()
    const id = toSlug(name)

    brands = [ { id, name, href }, ...brands]
  })

  return brands
}

const processName = (name) => name.indexOf('ISDIN') > -1 ? name : `ISDIN ${name}`

const getProducts = async (url) => {
  const html = await page(url)
  const $ = cheerio.load(html)
  

  const nodes = $(productSelector)
  let products = []
  nodes.each((idx, el) => {
    const node = $(el)
    const url = toAbsoluteUrl(node.children('a').attr('href'))
    const title = `${$('.title_1', node).text().trim()} ${$('.title_2', node).text().trim()} ${$('.title_3', node).text().trim()}`.trim()
    const name = processName(title)
    const summary = $('.vende', node).text()
    const thumb = toAbsoluteUrl($('.img img', node).attr('src'))
    const id = toSlug(name)

    products = [ { 
      id, 
      name, 
      title,      
      url,
      lab: 'isdin',
      brand: '',
      classifications: {
        corporate: []
      }, 
      texts: { 
        list: { 
          title: title, 
          summary 
        } 
      },
      imgs: {
        site: {
          thumb
        } 
      },
      info: {},
      ratings: {},      
      ingredients: {}
    }, ...products]
  })

  return products    
}

const withProducts = async(items) => {
  const results = await Promise.all(
    items.map(async(i) => {
      const products = await getProducts(i.href)
      i.products = products
      return i
    })
  )

  return results
}

const toAbsoluteUrl = (url) => {
  const root = 'http://www.isdin.com'
  const roots = 'https://www.isdin.com'
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

const merge = (existing, next) => {
  const corporate = [ ...new Set(
    [ ...existing.classifications.corporate, ...next.classifications.corporate ]
  ) ]

  if(existing.brand.length > 0 && next.brand.length > 0) {
    throw new Error('two brands')
  }

  const classifications = { corporate }
  const brand = [ existing.brand, next.brand ].join('').trim()

  return { ...existing, classifications, brand }
}

const unique = (arr) => {
  let results = []
  arr.forEach(x => { 
    const existing = results.findIndex(y => y.id === x.id)
    if(existing > -1) { 
      results[existing] = merge(results[existing], x)
    }
    else {
      results = [...results, x] 
    }
  })
  return results
}

const toSingleList = (treatments, brands) => {
  const all = flatten([ ...treatments, ...brands ])
  return unique(all)
}

;(async() => {
  const scrapeStart = process.hrtime()
  let treatments = await allTreatments()
  let brands = await allBrands()

  const tps = await withProducts(treatments)

  const pts = flatten(tps.map(x => x.products.map(p => ({ 
    ...p, 
    brand: '', 
    classifications: { corporate: [ x.id ] } 
  }))))

  const bps = await withProducts(brands)
  const pbs = flatten(bps.map(x => x.products.map(p => ({
    ...p,
    brand: x.id,
    classifications: {
      corporate: []
    }
  }))))

  console.log('pts', pts.length)
  console.log('pbs', pbs.length)

  const results = toSingleList(pts, pbs)
  console.log('results', results.length)

  // console.log('item[0]', results[0])
  const scrapeEnd = process.hrtime(scrapeStart)

  const saveStart = process.hrtime()
  const db = initDb()
  await Promise.all(
    results.map(async (x) => await db.product.create({ data: x }))
  )
  const saveEnd = process.hrtime(saveStart)

  console.info('Scrape time (hr): %ds %dms', scrapeEnd[0], scrapeEnd[1] / 1000000)
  console.info('Save time (hr): %ds %dms', saveEnd[0], saveEnd[1] / 1000000)

})()




