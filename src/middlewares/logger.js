const winston = require('winston')

const logFormat = winston.format.printf(function (info) {
  return `${new Date().toISOString()}-${info.level}: ${info.message}`
})

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(winston.format.colorize(), logFormat),
  handleExceptions: true
})
const myWinstonOptions = {
  transports: [consoleTransport],
  exitOnError: false
}
// eslint-disable-next-line new-cap
const logger = new winston.createLogger(myWinstonOptions)

module.exports = function (app) {
  function logRequest (req, res, next) {
    if (!req.url.startsWith('/api-docs/')) {
      logger.info(`${req.method}> ${req.url}`)
    }

    next()
  }
  app.use(logRequest)

  function logError (err, req, res, next) {
    logger.error(err)
    next()
  }
  app.use(logError)
}

module.exports.logger = logger
