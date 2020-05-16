const logger = require('./middlewares/logger').logger
const githubService = require('./services/githubService')

require('dotenv').config()

const Run = async () => {
  logger.info('test run started')
  try {
    const { items } = await githubService.getMostStarred(new Date('2019-01-01'), 'python')

    if (items) {
      for (const x of items) {
        logger.info(`${x.name} - ${x.stars} - ${x.language}`)
      }
    }
  } catch (err) {
    logger.error(err.message)
  }

  logger.info('test run ended')
}

Run()
