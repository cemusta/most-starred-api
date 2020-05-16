const githubService = require('./githubService')
jest.doMock('../middlewares/logger', () => {
  return {}
})

describe('Testing github service', () => {
  describe('rateLimitCheck()', () => {
    const header = {
      'x-ratelimit-limit': '30',
      'x-ratelimit-remaining': '29',
      'x-ratelimit-reset': '1589640328'
    }
    it('should return correct values from header', () => {
      const { remain, limit } = githubService.rateLimitCheck(header)
      expect(remain).toBe('29')
      expect(limit).toBe('30')
    })
    it('should return null if header info is missing', () => {
      const { remain, limit } = githubService.rateLimitCheck({})
      expect(remain).toBe(null)
      expect(limit).toBe(null)
    })
  })

  describe('queryBuilder()', () => {
    it('should return correct query with only date', () => {
      const query = githubService.queryBuilder(new Date('2015-11-03'))
      expect(query).toBe('q=created:>2015-11-03')
    })

    it('should return correct query with date and language', () => {
      const query = githubService.queryBuilder(new Date('2015-11-03'), 'nodejs')
      expect(query).toBe('q=created:>2015-11-03+language:nodejs')
    })
  })
})
