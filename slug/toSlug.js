const isSlug = require('./isSlug')
const { maxLength } = require('./schema')
const substitutions = require('./substitutions')

const toSlug = (val) => {
  if(isSlug(val)) {
    console.log('is slug')
    return val;
  }

  let result = mapChars(substitutions, val)
    .replace(/-/gi, ' ')
    .replace(/[^a-z0-9\s-]/gi, '')
    .replace(/\s+/gi, ' ')
    .trim()
    .toLowerCase()

  if (result.length > maxLength)
  {
    result = result.slice(0, maxLength).trim()
  }

  result = result.replace(/\s/gi, '-');
  return result
}

const mapChars = (subs, val) => {
  if(val && typeof val === 'string') {
    const chars = Object.getOwnPropertyNames(subs)
    const result = val.split('').map(c => chars.includes(c) ? subs[c] : c)
    return result.join('')    
  }
  return val
}

module.exports = toSlug