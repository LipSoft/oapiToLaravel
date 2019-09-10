const {yamlToObject} = require('../lib/common')
yamlToObject('../../build/petstore.yaml')


const oapiToModels = require('../lib/oapiToModels')
const petstore = yamlToObject('../../build/petstore.yaml')
oapiToModels(petstore)

