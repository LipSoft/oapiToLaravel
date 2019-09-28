'use strict'

const common = require('../common')

const templates = {
  create: common.loadTemplate('../../build/templates/oapiToViews/create.mustache'),
  edit: common.loadTemplate('../../build/templates/oapiToViews/edit.mustache'),
  index: common.loadTemplate('../../build/templates/oapiToViews/index.mustache'),
  show: common.loadTemplate('../../build/templates/oapiToViews/show.mustache')
}

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

const generateLaravelViewsFields = (schema, openapi) => schema && schema.type === 'object' && schema.properties &&
Object.entries(schema.properties).map(([property, propertyValue]) => ({ field: property })).filter(field => fieldIsFK(field, openapi))

const generateLaravelViews = (schema, name, openapi) => {
  const views = ['create', 'edit', 'index', 'show']

  return views.map(x => ({ name: x,
    template: templates[x],
    content: {
      name,
      capitalizedName: common.capitalize(name),
      pk: 'id',
      fields: generateLaravelViewsFields(schema, openapi),
      belongsTo: belongsToFromSchema(schema),
      hasMany: hasManyFromSchema(schema),
      entities: Object.keys(openapi.components.schemas).map(x => ({ capitalizedName: common.capitalize(x), name: x })).filter(x => x.name !== 'users')
    } }))
}
const viewsFromSchemas = openapi => Object.entries(openapi.components.schemas).map(([view, viewValue]) => {
  return {
    name: `${view}`,
    fields: fieldsFromSchema(viewValue, openapi),
    views: generateLaravelViews(viewValue, view, openapi)
  }
}, {
  name: '',
  fields: [],
  hidden: [],
  views: []
})

const generateViews = openapi => openapi && openapi.components && openapi.components.schemas && viewsFromSchemas(openapi)

module.exports = openapi => generateViews(openapi)
