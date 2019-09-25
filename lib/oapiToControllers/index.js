'use strict'

const common = require('../common')

const belongsToFromSchema = schema => schema && schema.type === 'object' && schema['x-ls'] && schema['x-ls'].belongsTo &&
Object.entries(schema['x-ls'].belongsTo).map(([constraint, constraintValue]) => constraintValue).filter(x => x.referencedTableName != null)

const hasManyFromSchema = schema => schema && schema.type === 'object' && schema['x-ls'] && schema['x-ls'].hasMany &&
Object.entries(schema['x-ls'].hasMany).map(([constraint, constraintValue]) => constraintValue).filter(x => x.referencedTableName != null)

const fieldsFromSchema = schema => schema && schema.type === 'object' && schema.properties &&
Object.entries(schema.properties).map(([property, propertyValue]) => ({ field: property }))

const modelsFromSchemas = schemas => Object.entries(schemas).map(([schema, schemaValue]) => {
  return {
    name: common.capitalize(schema),
    fields: fieldsFromSchema(schemaValue),
    belongsTo: belongsToFromSchema(schemaValue),
    hasMany: hasManyFromSchema(schemaValue)
  }
}, {
  name: '',
  fields: [],
  hidden: [],
  belongsTo: [],
  hasMany: []
})
const generateViews = openapi => openapi && openapi.components && openapi.components.schemas && modelsFromSchemas(openapi.components.schemas)

module.exports = openapi => generateViews(openapi)
