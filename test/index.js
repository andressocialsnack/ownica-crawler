const test = require('baretest')('katipo tests')
const assert = require('assert')

const slug = require('../slug')

require('./slug/schema.test')(test, assert, slug.schema)

;!(async function () {
  await test.run()
})()
