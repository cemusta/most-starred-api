
module.exports = function (app) {
  app.use('/api/starred', require('../routers/starredRouter'))
}
