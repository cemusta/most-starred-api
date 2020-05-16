const cors = require('cors')
const express = require('express')
// setup global middleware here

module.exports = function (app) {
  app.disable('x-powered-by')
  app.use(cors())

  app.use(express.json({ type: 'application/json' }))
}
