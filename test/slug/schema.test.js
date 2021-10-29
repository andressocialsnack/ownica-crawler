const Ajv = require('ajv')

const schemaTest = (test, assert, schema) => {
  test('fails correctly', () => {
    const slug = 'this should fail'

    const ajv = new Ajv({ allErrors: true })
    const validate = ajv.compile(schema)

    const valid = validate(slug)
    assert.equal(false, valid)
  })

  test('fails correctly when length excessive', () => {
    const slug = 'this-should-fail-this-should-fail-this-should-fail-this-should-fail-this-should-fail-this-should-fail-this-should-fail-this-should-fail'

    const ajv = new Ajv({ allErrors: true })
    const validate = ajv.compile(schema)

    const valid = validate(slug)
    assert.equal(false, valid)
  })

  test('passes correctly', () => {
    const slug = 'this-should-pass'

    const ajv = new Ajv({ allErrors: true })
    const validate = ajv.compile(schema)

    const valid = validate(slug)
    assert.equal(true, valid)    
  })  
}

module.exports = schemaTest