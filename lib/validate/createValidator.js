const Ajv = require('ajv')

const createValidator = (schema) => {
  const s = schema.isFluentSchema ? schema.valueOf() : schema
  const ajv = new Ajv({ allErrors: true })
  const compiled = ajv.compile(s)

  const validate = (item) => {
    const isValid = compiled(item)
    return ({
      isValid,
      errors: compiled.errors || []
    })
  }

  return validate
}

module.exports = createValidator
