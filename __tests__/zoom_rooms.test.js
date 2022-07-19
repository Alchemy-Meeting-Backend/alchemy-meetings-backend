const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  xit('GET/ should display a list of zoom rooms', async () => {
    const res = await request(app).get('/api/v1/zoomrooms');
    expect(res.body.length).toEqual(3);
  });

  xit('GET/ should display a list of zoomrooms by cohort id', async () => {
    const res = await request(app).get('/api/v1/zoomrooms');
    expect(res.body).toEqual({
      id: '1',
      zoomroom: 'Goodland',
    });
  });

  afterAll(() => {
    pool.end();
  });
});
