'use strict'

const common = require('../common')

module.exports = openapi => openapi && openapi.components &&
    openapi.components.schemas &&
    ({ schemas: Object.entries(openapi.components.schemas).map(([schema, schemavalue]) => ({ name: common.capitalize(schema) })) })
