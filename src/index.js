const logger = require('./middlewares/logger').logger
const githubService = require('./services/githubService')

require('dotenv').config()

const Run = async () => {
  logger.info('test started')
  const items = await githubService.getStars(new Date('2020-01-01'), 'python')

  if (items) {
    for (const x of items) {
      logger.info(`${x.name} - ${x.stars} - ${x.language}`)
    }
  }
  logger.info('test ended')
}

Run()
