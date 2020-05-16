const express = require('express')
const logger = require('./middlewares/logger').logger

const app = express()

require('./middlewares/logger')(app)

require('./middlewares/default')(app)

require('./middlewares/routes')(app)

require('./middlewares/swagger')(app)

logger.info('default API initialized.')

// export the app for testing
module.exports = app
