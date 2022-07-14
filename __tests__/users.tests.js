const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const GithubUser = require('../lib/models/GithubUser');

jest.mock('../lib/services/github');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('/users should return a list of users', async () => {
    const res = await request(app).get('/users');
    const userData = await GithubUser.getAll();
    const expected = await userData.map((user) => {
      return { username: user.username, email: user.email, cohort_id: user.cohort_id, role: user.role };
    });
    console.log('expected', expected);
    expect(res.body).toEqual(expected);
  });

  
  afterAll(() => {
    pool.end();
  });
});


