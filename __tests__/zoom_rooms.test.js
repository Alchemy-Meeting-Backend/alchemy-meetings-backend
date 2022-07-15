const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET/ should display a list of zoom rooms', async () => {
    const res = await request(app).get('/api/v1/zoomrooms');
    expect(res.body.length).toEqual(2);
  });


  afterAll(() => {
    pool.end();
  });
});
