const { common, oapiToModels, oapiToControllers } = require('../lib')

const { render, loadTemplate } = require('../lib/common')
const modelTemplate = loadTemplate('../../build/templates/oapiToModels/model.mustache')
const controllerTemplate = loadTemplate('../../build/templates/oapiToControllers/controller.mustache')

// const petstore = common.yamlToObject('../../build/petstore.yaml')
const imported = require('../build/imported/fromMysql.json')

oapiToModels(imported).forEach(schema => {
  common.saveFile(`../../dist/oapiToModels/${schema.name}.php`, render(modelTemplate, schema))
})

oapiToControllers(imported).forEach(schema => {
  common.saveFile(`../../dist/oapiToControllers/${schema.name}.php`, render(controllerTemplate, schema))
})
