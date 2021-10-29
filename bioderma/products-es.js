const { readFileSync, writeFileSync } = require('fs')
const cheerio = require('cheerio')
const { initDb } = require('../lib')
const { page } = require('../loaders')
const { toSlug } = require('../slug')
const { flatten } = require('../utils')

const url = 'https://www.bioderma.es/nuestros-productos'
const areaSelector = '#edit-field-productadviceareas-target-id--wrapper > div.js-form-item'
const brandSelector = '#edit-field-productrange-target-id--wrapper > div.js-form-item'
const productTypeSelector = '#edit-field-productcategory-target-id--wrapper > div.js-form-item'
const skinTypeSelector = '#edit-field-productsubindication-target-id--wrapper > div.js-form-item'
const spfSelector = '#edit-field-product-spf-target-id--wrapper > div.js-form-item'
const distinctionSelector = '#edit-field-productdistinction-target-id--wrapper > div.js-form-item'

const productSelector = '.result-product-item'

const headerCountSelector = '.filter-header__count'

const measurements = [ 'ml', 'l', 'kg', 'g']

const processName = (name) => name.indexOf('BIODERMA') > -1 ? name : `BIODERMA ${name}`

const processInfo = (info) => {
  if(!info) {
    return [ undefined, undefined, undefined ]
  }
  
  const parts = info.split(',')
  if(parts.length >= 3) {
    const namePart = parts[1]
    const nps = namePart.split(' ')
    const sizePart = nps.slice(-1)[0].toLowerCase()
    if(sizePart.match(/^\d/)) {
      let msi = -1;
      measurements.forEach((m, idx) => {
        if(msi === -1 && sizePart.indexOf(m) > -1) {
          msi = idx
        }
      })

      if(msi === -1) {
        throw new Error(`${sizePart} wrong`)
      }

      const unit = measurements[msi]
      const [ qty, ...rest ] = sizePart.split(unit)

      const esName = nps.slice(0, -1).join(' ').trim()
      const esDesc = parts.slice(-1)[0].trim()

      const size = {
        qty,
        unit,
        text: sizePart
      }
      return [ size, esName, esDesc ]        
    }
    
    return [ undefined, nps.slice(0, -1).join(' ').trim(), parts.slice(-1)[0].trim() ]
  }

  throw new Error(`${parts.length} many parts ${info}`)
}

const getProducts = async (url) => {
  const html = await page(url)
  const $ = cheerio.load(html)
  

  const nodes = $(productSelector)
  let products = []
  nodes.each((idx, el) => {
    // if(idx === 0) {
    const node = $(el)
    const url = toAbsoluteUrl($(node.children('.product-url')).attr('href'))
    const info = $('picture > img', node).attr('title')
    const title = $('.content h2', node).text().replace(/\n/g, '').replace(/ +/g, ' ').trim()    
    const name = processName(title)
    
    const [ size, esName, esDesc ] = processInfo(info)

    const tech = $('p.tech', node).text().trim()
    const category = $('div.title', node).text().trim()

    let skinTypes = []
    const skin = $('p.skin span', node).each((idx, el) => {
      skinTypes = [...skinTypes, $(el).text().trim()]
    })
    
    const thumb = toAbsoluteUrl($('picture > source', node).first().attr('data-srcset'))
    const id = toSlug(name)

    products = [ { 
      id, 
      name, 
      title,      
      url,
      lab: 'bioderma',
      brand: '',
      classifications: {
        corporate: [],
        skin_types: skinTypes || [],
        categories: category ? [ category ] : []
      }, 
      texts: { 
        list: { 
          title: title,
          alt_title: esName || '', 
          summary: esDesc || '' 
        } 
      },
      imgs: {
        site: {
          thumb
        } 
      },
      info: {
        presentations: size ? [ size ] : [],
        tech: tech ? [ tech ] : []
      },
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
  const root = 'http://www.bioderma.es/'
  const roots = 'https://www.bioderma.es/'
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

const classificationOptions = ($, nodes) => {
  let treatments = []
  nodes.each((idx, el) => {    
    const lnk = $('input', el)
    const lbl = $('label', el)
    
    const href = `${url}?${lnk.attr('name')}=${lnk.attr('value')}`
    const name = lbl.text()
    const id = toSlug(name)

    treatments = [ { id, name, href }, ...treatments]
  })

  return treatments  
}

const classifications = async () => {
  const html = await page(url)
  const $ = cheerio.load(html)

  const classifications = [
    areaSelector,
    productTypeSelector,
    skinTypeSelector,
    spfSelector,
    distinctionSelector
  ]

  const allAreas = classifications.map(selector => {
    const nodes = $(selector)
    return classificationOptions($, nodes)
  })

  const brandNodes = $(brandSelector)
  const allBrands = classificationOptions($, brandNodes)
  const areas = [].concat(...allAreas)

  return [ areas, allBrands]
}

const merge = (existing, next) => {
  const corporate = [ ...new Set(
    [ ...existing.classifications.corporate, ...next.classifications.corporate ]
  ) ]

  const skinTypes = [ ...new Set(
    [ ...existing.classifications.skin_types, ...next.classifications.skin_types ]
  ) ]    

  const categories = [ ...new Set(
    [ ...existing.classifications.categories, ...next.classifications.categories ]
  ) ]

  if(existing.brand.length > 0 && next.brand.length > 0) {
    throw new Error('two brands')
  }

  const edp = existing.info.presentations.map(x => x.text)
  const ndp = next.info.presentations.map(x => x.text)
  const keys = [ ...new Set([ ...edp, ...ndp ]) ]
  const all = [ ...existing.info.presentations, ...next.info.presentations ]
  const presentations = keys.map(x => all.find(y => y.text === x))

  const tech = [ ...new Set(
    [ ...existing.info.tech, ...next.info.tech ]
  ) ]


  const classifications = { corporate, skin_types: skinTypes, categories }    
  const info = { presentations, tech }
  const brand = [ existing.brand, next.brand ].join('').trim()

  return { ...existing, classifications, info, brand }
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
  const [ areas, brands ] = await classifications()

  const aps = await withProducts(areas)
  const pas = flatten(aps.map(x => x.products.map(p => ({ 
    ...p, 
    brand: '', 
    classifications: { 
      ...p.classifications, 
      corporate: [ x.id ] 
    } 
  }))))

  const bps = await withProducts(brands)
  const pbs = flatten(bps.map(x => x.products.map(p => ({
    ...p,
    brand: x.id,
    classifications: {
      ...p.classifications,       
      corporate: []
    }
  }))))

  console.log('pas', pas.length)
  console.log('pbs', pbs.length)

  const results = toSingleList(pas, pbs)
  console.log('results', results.length)

  const scrapeEnd = process.hrtime(scrapeStart)
  // console.log('opts', options)

  console.info('Scrape time (hr): %ds %dms', scrapeEnd[0], scrapeEnd[1] / 1000000)  
  
  const saveStart = process.hrtime()
  const db = initDb()
  await Promise.all(
    results.map(async (x) => await db.product.create({ data: x }))
  )
  const saveEnd = process.hrtime(saveStart)

  console.info('Classification time (hr): %ds %dms', saveEnd[0], saveEnd[1] / 1000000)  

})();
