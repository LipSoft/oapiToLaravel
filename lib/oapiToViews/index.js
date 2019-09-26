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

const fieldsFromSchema = schema => schema && schema.type === 'object' && schema.properties &&
Object.entries(schema.properties).map(([property, propertyValue]) => ({ field: property }))

const generateLaravelViewsFields = schema => schema && schema.type === 'object' && schema.properties &&
Object.entries(schema.properties).map(([property, propertyValue]) => ({ field: property }))

const generateLaravelViews = (schema, name) => {
  const views = ['create', 'edit', 'index', 'show']

  return views.map(x => ({ name: x,
    template: templates[x],
    content: {
      name,
      capitalizedName: common.capitalize(name),
      pk: 'id',
      fields: generateLaravelViewsFields(schema),
      belongsTo: belongsToFromSchema(schema),
      hasMany: hasManyFromSchema(schema)
    } }))
}
const viewsFromSchemas = schemas => Object.entries(schemas).map(([view, viewValue]) => {
  return {
    name: `${view}`,
    fields: fieldsFromSchema(viewValue),
    views: generateLaravelViews(viewValue, view)
  }
}, {
  name: '',
  fields: [],
  hidden: [],
  views: []
})

const generateViews = openapi => openapi && openapi.components && openapi.components.schemas && viewsFromSchemas(openapi.components.schemas)

module.exports = openapi => generateViews(openapi)
