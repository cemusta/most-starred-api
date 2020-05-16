const githubService = require('./services/githubService')

require('dotenv').config()

const Run = async () => {
  await githubService.getStars()
}

Run()
