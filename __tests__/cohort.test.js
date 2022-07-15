const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET/ should return a list of cohorts', async () => {
    const res = await request(app).get('/api/v1/cohorts');
    expect(res.body).toEqual([
      {
        id: '1',
        name: 'feb 2022',
      },
      {
        id: '2',
        name: 'jan 2022',
      },
    ]);
  });

  afterAll(() => {
    pool.end();
  });
});
