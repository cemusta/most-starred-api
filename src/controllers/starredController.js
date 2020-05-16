// const logger = require('../middlewares/logger').logger
const githubService = require('../services/githubService')

// get: /api/starred/
exports.get = async (req, res) => {
  try {
    const items = await githubService.getMostStarred(new Date('2019-01-01'))

    return res.status(200).json(items)
  } catch (ex) {
    return res.status(500).json(ex.message)
  }
}
