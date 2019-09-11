'use strict'

const fieldsFromSchema = schema => schema && schema.type === 'object' && schema.properties &&
Object.entries(schema.properties).map(([property, a]) => ({ field: property }))

const modelsFromSchemas = schemas => Object.entries(schemas).map(([schema, schemaValue]) => {
  return {
    name: schema,
    fields: fieldsFromSchema(schemaValue)
  }
}, {
  name: '',
  fields: [],
  hidden: []
})
const generateViews = openapi => openapi && openapi.components && openapi.components.schemas && modelsFromSchemas(openapi.components.schemas)

module.exports = openapi => generateViews(openapi)
