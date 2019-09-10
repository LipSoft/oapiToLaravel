const yaml = require('yaml')
const fs = require('fs')
const path = require('path')
module.exports = {
    yamlToObject : filePath => yaml.parse(fs.readFileSync( path.join(__dirname, filePath), 'utf8')) 
}