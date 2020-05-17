const superagent = require('superagent')
const logger = require('../middlewares/logger').logger

const getMostStarred = async (sinceDate = null, language = null) => {
  try {
    const request = superagent.get('https://api.github.com/search/repositories')
      .query(queryBuilder(sinceDate, language))
      .query({ sort: 'stars', order: 'desc', per_page: 100 })
      .set('User-Agent', 'wrapper-api')

    if (process.env.GITHUB_TOKEN) {
      request.set('Authorization', `token ${process.env.GITHUB_TOKEN}`)
    } else if (process.env.GITHUB_USER && process.env.GITHUB_PASS) {
      console.debug('basic auth depriciated, will stop working after November 13, 2020 at 4:00 PM UTC')
      request.auth(process.env.GITHUB_USER, process.env.GITHUB_PASS)
    }

    const res = await request

    if (res.status !== 200) {
      logger.info('handle status', res)
      return null
    }

    const { text, header } = res

    let { items, ...rest } = JSON.parse(text)

    items = items.map((x, i) => ({
      idx: i,
      name: x.name,
      id: x.id,
      stars: x.stargazers_count,
      html_url: x.html_url,
      created_at: x.created_at,
      language: x.language
    }))

    logger.info(`returned ${items.length} items`)

    if (rest.incomplete_results) {
      logger.warn('Incomplete results...')
    }

    checkRateLimit(header)

    return { items, ...rest }
  } catch (err) {
    if (err.status === 403) {
      const res = err.response
      logger.error('rate limit reached.')
      checkRateLimit(res.header)
      return null
    }

    if (err.status === 401) {
      logger.error('auth failed.')
      return null
    }

    if (err.status >= 500) {
      logger.error('server error.')
      return null
    }

    // throw other unhandled errors
    throw err
  }
}

const queryBuilder = (date = null, language = null) => {
  let query = 'q='

  logger.debug({ date, language })
  date = date || new Date()
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
  query = query + `created:>${ye}-${mo}-${da}`

  if (language) {
    query += `+language:${language.toLowerCase()}`
  }

  return query
}

const checkRateLimit = (header) => {
  const { 'x-ratelimit-limit': limit = null, 'x-ratelimit-remaining': remain = null, 'x-ratelimit-reset': reset = null } = header
  const time = new Date(reset * 1000) - Date.now()
  if (limit && remain) {
    logger.info(`you have ${remain}/${limit} rate left, reset time: ${time / 1000} seconds`)
  } else {
    logger.warn('rate limiting info missing, please check api documentation for changes')
  }
  return { limit, remain, time }
}

module.exports = {
  getMostStarred,
  queryBuilder,
  checkRateLimit
}
