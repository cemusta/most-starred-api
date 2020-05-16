jest.doMock('../src/middlewares/logger', () => {
  return {
    logger: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    }
  }
})

beforeEach(() => {
  jest.resetModules()
})

const mockText = JSON.stringify(require('./mock/response.json'))
const mockHeader = {
  'x-ratelimit-limit': '30',
  'x-ratelimit-remaining': '29',
  'x-ratelimit-reset': '1589640328'
}

describe('Testing github service', () => {
  describe('rateLimitCheck()', () => {
    const githubService = require('../src/services/githubService')
    it('should return correct values from header', () => {
      const { remain, limit, time } = githubService.rateLimitCheck(mockHeader)
      expect(remain).toBe('29')
      expect(limit).toBe('30')
      expect(time).toBeCloseTo(new Date(1589640328 * 1000) - Date.now(), -4) // 5 sec diffrence
    })
    it('should return null if header info is missing', () => {
      const { remain, limit } = githubService.rateLimitCheck({})
      expect(remain).toBe(null)
      expect(limit).toBe(null)
    })
  })

  describe('queryBuilder()', () => {
    const githubService = require('../src/services/githubService')
    it('should return correct query with only date', () => {
      const query = githubService.queryBuilder(new Date('2015-11-03'))
      expect(query).toBe('q=created:>2015-11-03')
    })

    it('should return correct query with date and language', () => {
      const query = githubService.queryBuilder(new Date('2015-11-03'), 'nodejs')
      expect(query).toBe('q=created:>2015-11-03+language:nodejs')
    })
  })

  describe('getMostStarred()', () => {
    it('should return item list from github api', async () => {
      jest.mock('superagent', () => ({
        get: jest.fn(() => {}).mockReturnThis(),
        query: jest.fn(() => {}).mockReturnThis(),
        set: jest.fn(async () => {
          return { status: 200, text: mockText, header: mockHeader }
        })
      }))
      const githubService = require('../src/services/githubService')

      const result = await githubService.getMostStarred(new Date('2019-01-01'), 'python')
      expect(result).toHaveProperty('incomplete_results', true)
      expect(result).toHaveProperty('items')
      expect(result.items.length).toBe(30)
    })
  })
})
