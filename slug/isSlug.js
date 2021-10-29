const { maxLength, regex } = require('./schema')

const isSlug = (val) => val &&
  (val.trim().length > 0 || val.trim().length <= maxLength) &&
  regex.test(val)

module.exports = isSlug