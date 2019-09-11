'use strict'

const modelsFromSchemas = schemas => Object.entries(schemas).map(([schema, schemaValue]) => {
  return {
    name: schema
  }
}, {
  name: ''
})
const generateViews = openapi => openapi && openapi.components && openapi.components.schemas && modelsFromSchemas(openapi.components.schemas)

module.exports = openapi => generateViews(openapi)
