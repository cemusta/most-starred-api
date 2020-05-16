const superagent = require('superagent')

const getStars = async (date, language = null) => {
  try {
    date = date || new Date()

    const request = superagent.get('https://api.github.com/search/repositories')

      .query({ q: queryBuilder(date, language), sort: 'stars', order: 'desc', per_page: 100 })
      .set('User-Agent', 'wrapper-api')

    if (process.env.GITHUB_TOKEN) {
      request.set('Authorization', `token ${process.env.GITHUB_TOKEN}`)
    } else if (process.env.GITHUB_USER && process.env.GITHUB_PASS) {
      console.debug('basic auth depriciated, will stop working after November 13, 2020 at 4:00 PM UTC')
      request.auth(process.env.GITHUB_USER, process.env.GITHUB_PASS)
    }

    const res = await request

    if (res.status !== 200) {
      console.debug('handle status', res)
      return null
    }

    const { text, header } = res

    let { items, ...result } = JSON.parse(text)

    items = items.map((x, i) => ({
      idx: i,
      name: x.name,
      id: x.id,
      stars: x.stargazers_count,
      html_url: x.html_url,
      created_at: x.created_at
    }))

    if (result.incomplete_results) {
      console.error('Incomplete', result)
    }

    console.log(items)

    rateLimitCheck(header)
  } catch (err) {
    if (err.status === 403) {
      const res = err.response
      console.error('rate limit reached.')
      rateLimitCheck(res.header)
      return null
    }

    if (err.status === 401) {
      console.error('auth failed.')
      return null
    }

    // other errors
    console.error('other', err)
  }
}

const queryBuilder = (date, language) => {
  console.log({ date, language })
  return 'edit'
}

const rateLimitCheck = (header) => {
  const { 'x-ratelimit-limit': limit, 'x-ratelimit-remaining': remain, 'x-ratelimit-reset': reset } = header

  const time = new Date(reset * 1000) - Date.now()
  console.log(`you have ${remain}/${limit} rate left, reset time: ${time / 1000} seconds`)
}

module.exports = {
  getStars
}
