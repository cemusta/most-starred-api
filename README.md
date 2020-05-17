[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cemusta/most-starred-api/blob/master/LICENSE)
[![GitHub actions](https://github.com/cemusta/most-starred-api/workflows/Node.js%20CI/badge.svg)](https://github.com/cemusta/most-starred-api/actions)
[![codecov](https://codecov.io/gh/cemusta/most-starred-api/branch/master/graph/badge.svg)](https://codecov.io/gh/cemusta/most-starred-api)
[![CodeFactor](https://www.codefactor.io/repository/github/cemusta/most-starred-api/badge)](https://www.codefactor.io/repository/github/cemusta/most-starred-api)

# Most starred api - Getting most starred repos

This repository contains a small nodejs/express app using Githubs public search endpoints for listing most starred endpoints.

## Deployed example

Heres the link for deployed example working on google cloud app engine standard

> https://github-most-starred.appspot.com


## How to run

Install dependencies using, `npm install`, then you can directly start api in local environment.

```bash
npm start
```

App is starting with swagger ui so you can directly use it to invoke calls to api, from http://localhost:8080/api-docs/

Github API has a rate-limit of 10 searches if unauthorized and 30 if using authorization. You can add authorization if you app envrionment variables `GITHUB_TOKEN` for Oauth or `GITHUB_USER` / `GITHUB_PASS` couple for basic auth.


## Tests and linting

for running tests, use:

```bash
npm run test
```

for checking linting, use:

```bash
npm run lint
```

### list of possible improvements for future

- adding throttling to handle rate limit gracefully
- adding distrubuted cache layer for scaling
- deployment automation