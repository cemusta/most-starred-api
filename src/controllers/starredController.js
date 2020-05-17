// const logger = require('../middlewares/logger').logger
const moment = require('moment')
const githubService = require('../services/githubService')

// get: /api/starred/
exports.get = async (req, res) => {
  try {
    const date = (req.query && req.query.date)
    if (!moment(date).isValid()) {
      return res.status(403).json({ message: 'date is not valid' })
    }
    const language = (req.query && req.query.language) || null
    const limit = (req.query && parseInt(req.query.limit)) || 10
    if (![10, 50, 100].includes(limit)) {
      return res.status(403).json({ message: 'limit should be 10, 50 or 100' })
    }

    const { result, limits, ttl } = await githubService.getMostStarred(new Date(date), language)

    if (result.items && result.items.length > limit) {
      result.items = result.items.slice(0, limit)
    }

    if (ttl) {
      res.set({
        'x-cache-hit': true,
        'x-cache-ttl': ttl
      })
    } else if (limits) {
      res.set({
        'x-cache-hit': false,
        'x-rate-limit': limits.limit,
        'x-rate-limit-left': limits.remain,
        'x-rate-limit-reset': limits.time
      })
    }

    return res.status(200).json(result)
  } catch (ex) {
    return res.status(500).json(ex.message)
  }
}
