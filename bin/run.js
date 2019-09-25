const { common, oapiToModels, oapiToControllers, oapiToViews } = require('../lib')

const { render, loadTemplate } = require('../lib/common')
const modelTemplate = loadTemplate('../../build/templates/oapiToModels/model.mustache')
const controllerTemplate = loadTemplate('../../build/templates/oapiToControllers/controller.mustache')

// const petstore = common.yamlToObject('../../build/petstore.yaml')
const imported = require('../build/imported/fromMysql.json')

oapiToModels(imported).forEach(schema => {
  common.saveFile(`../../dist/app/${common.capitalize(schema.name)}.php`, render(modelTemplate, schema))
})

oapiToControllers(imported).forEach(schema => {
  common.saveFile(`../../dist/app/Http/Controllers/${common.capitalize(schema.name)}Controller.php`, render(controllerTemplate, schema))
})

oapiToViews(imported).forEach(schema => {
  schema.views.forEach(view => common.saveFile(`../../dist/resources/views/${schema.name}/${view.name}.blade.php`, render(view.template, view.content)))
})
