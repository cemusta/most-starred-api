'use strict'

const config = require('../config')
const logger = require('./logger').logger

const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

module.exports = function (app) {
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        description: 'Swagger documentation for github most starred challenge api',
        title: 'Github Most Starred API',
        version: '1.0.0'
      },
      produces: ['application/json', 'application/xml'],
      host: config.server_host,
      schemes: [config.server_scheme],
      tags: [
        {
          name: 'starred',
          description: 'Most starred repositories endpoints'
        }
      ]
    },
    apis: [('./src/routers') + '/**/*.js']
  }

  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  const swaggerDocument = swaggerJSDoc(swaggerOptions)

  // SwaggerUi
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  )

  app.get('/', function (req, res) {
    res.redirect('/api-docs')
  })

  logger.info(`swagger enabled, docs available on: ${config.server_scheme}://${config.server_host}/api-docs/`)
}
