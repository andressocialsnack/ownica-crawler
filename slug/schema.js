const s = require('fluent-schema')

const maxLength = 128
const pattern = /(^[a-z0-9])([a-z0-9_-]+)*([a-z0-9])$/
const regex = new RegExp(pattern)
const url = 'https://schemas.sanu.dev/slug'

const schema = s.string()
  .id(url)
  .title('slug')
  .maxLength(maxLength)
  .pattern(pattern)

module.exports = {
  maxLength,
  pattern,
  regex,
  schema: schema.valueOf(),
  url
}