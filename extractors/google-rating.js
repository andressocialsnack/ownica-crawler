const cheerio = require('cheerio')

const extractNum = require('./parentheses')
const { google } = require('../loaders')

const starsSelector = 'g-review-stars'
const headerSelector = 'div[role="heading"]'

const googleRatings = async (searchTerm) => {
  const content = await google(searchTerm)

  const $ = cheerio.load(content)

  const filtered = $(starsSelector).filter((idx, el) => {
    const text = $(el).parent().parent().prev(headerSelector).text().trim()
    return text.toLowerCase() === searchTerm
  }).parent().parent().parent()

  if(filtered.length === 1) {
    const filter = $(filtered[0])
    const term = searchTerm
    const rating = filter.find(starsSelector).prev().text()
    const amt = filter.find(starsSelector).next().text()

    return ({
      term,
      rating,
      responses: extractNum(amt)
    })
  }

  console.log(`${filtered.length} ratings for ${searchTerm}`)
  return {}
}

module.exports = googleRatings