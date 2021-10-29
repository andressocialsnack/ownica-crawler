const s = require('fluent-schema')
const { createValidator } = require('../lib')
const { schema: slugSchema, url: slugUrl } = require('../slug')

const url = 'https://schemas.sanu.dev/lab'

const schema = s.object()
  .id(url)
  .title('lab')
  .definition('slugSchema', slugSchema)  
  .prop(
    'id', 
    s.ref(slugUrl)
  ).required()
  .prop(
    'name', 
    s.string()
      .maxLength(128)
  ).required()

const validate = createValidator(schema)

const create = (db) => async (lab) => {
  const validation = validate(lab)
  if(validation.isValid) {
    const result = await db.lab.create({ data: lab })
    return result    
  }
  return validation
}

const update = (db) => async (lab) => {
  const validation = validate(lab)
  if(validation.isValid) {
    const result = await db.lab.update(lab)
    return result    
  }
  return validation  
}

const store = (db) => ({
  create: create(db),
  update: update(db)
})

module.exports = store
