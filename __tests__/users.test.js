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
  
  it('GET /github should return a list of users', async () => {
    const res = await request(app).get('/api/v1/github');
    const userData = await GithubUser.getAll();
    const expected = await userData.map((user) => {
      return { id: user.id, username: user.username, email: user.email, cohort_id: user.cohort_id, role: user.role };
    });
    expect(res.body).toEqual(expected);
  });

  it('GET /github/:id should get a user', async () => {
    const res = await request(app).get('/api/v1/github/1');
    const expected = await GithubUser.getById(1);
    expect(res.body).toEqual(expected);
  });

  it('PUT should update a users cohort_id', async () => {
    const res = await request(app).put('/api/v1/github/1').send({ cohort_id: 2 });
    const expected = await GithubUser.getById(1);
    expect(res.body).toEqual(expected);
  });

  it('DELETE should delete a user', async () => {
    const res = await request(app).delete('/api/v1/github/1');
    expect(res.status).toEqual(200);
    expect(res.body.id).toEqual('1');
  });

  it('GET /github should return a list of pending users', async () => {
    const res = await request(app).get('/api/v1/github/pending');
    const userData = await GithubUser.getAllPending();
    const expected = await userData.map((user) => {
      return { id: user.id, username: user.username, email: user.email, cohort_id: user.cohort_id, role: user.role };
    });
    expect(res.body).toEqual(expected);
  });

  afterAll(() => {
    pool.end();
  });
});


