'use strict'

const common = require('../common')

const belongsToFromSchema = schema => schema && schema.type === 'object' && schema['x-ls'] && schema['x-ls'].belongsTo &&
Object.entries(schema['x-ls'].belongsTo).map(([constraint, constraintValue]) => constraintValue).filter(x => x.referencedTableName != null)

const hasManyFromSchema = schema => schema && schema.type === 'object' && schema['x-ls'] && schema['x-ls'].hasMany &&
Object.entries(schema['x-ls'].hasMany).map(([constraint, constraintValue]) => constraintValue).filter(x => x.referencedTableName != null)

const fieldIsFK = (field, openapi) => {
  let isPK = true
  Object.entries(openapi.components.schemas)
    .map(([schema, schemaValue]) => [...belongsToFromSchema(schemaValue)])
    .forEach(x => {
      x.forEach(y => {
        if (field.field === y.columnName) isPK = false
      })
    })
  return isPK
}

const fieldsFromSchema = (schema, openapi) => schema && schema.type === 'object' && schema.properties &&
Object.entries(schema.properties).map(([property, propertyValue]) => ({ field: property })).filter(field => fieldIsFK(field, openapi))

const modelsFromSchemas = openapi => Object.entries(openapi.components.schemas).map(([schema, schemaValue]) => {
  return {
    name: common.capitalize(schema),
    lowercaseName: schema.toLowerCase(),
    fields: fieldsFromSchema(schemaValue, openapi),
    belongsTo: belongsToFromSchema(schemaValue),
    hasMany: hasManyFromSchema(schemaValue),
    nameSpace: 'AMBERGEST'
  }
}, {
  name: '',
  fields: [],
  hidden: [],
  belongsTo: [],
  hasMany: []
})
const generateViews = openapi => openapi && openapi.components && openapi.components.schemas && modelsFromSchemas(openapi)

module.exports = openapi => generateViews(openapi)
