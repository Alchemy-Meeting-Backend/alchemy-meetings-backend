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

  const agent = request.agent(app);

  it('GET/ should display a list of zoomrooms by a users cohort id', async () => {
    const userResponse = await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    
    await agent
      .put(`/api/v1/github/${userResponse.body.id}`)
      .send({ cohort_id: 4 });

    await agent
      .delete('/api/v1/github/sessions');

    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    const res = await agent.get('/api/v1/zoomrooms');
    expect(res.body).toEqual([{ 'id': '1', 'room_name': 'Cobalt' }, { 'id': '2', 'room_name': 'Goodland' }]);
  });

  it('GET/ should display no zoomrooms for pending users, who have a cohort id of 1', async () => {
    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    const res = await agent.get('/api/v1/zoomrooms');
    expect(res.body).toEqual([]);
  });

  it('GET/ should display a list of all zoomrooms for staff, who have a cohort id of 2', async () => {
    const userResponse = await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    
    await agent
      .put(`/api/v1/github/${userResponse.body.id}`)
      .send({ cohort_id: 2 });

    await agent
      .delete('/api/v1/github/sessions');

    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    const res = await agent.get('/api/v1/zoomrooms');
    expect(res.body).toEqual([{ 'id': '1', 'room_name': 'Cobalt' }, { 'id': '2', 'room_name': 'Goodland' }, { 'id': '3', 'room_name': 'Copper' }]);
  });

  afterAll(() => {
    pool.end();
  });
});
