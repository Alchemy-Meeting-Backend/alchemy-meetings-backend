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

  xit('GET/ should display a list of zoom rooms', async () => {
    const res = await request(app).get('/api/v1/zoomrooms');
    expect(res.body.length).toEqual(3);
  });

  it('GET/ should display a list of zoomrooms by cohort id', async () => {
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
    expect(res.body).toEqual([{ 'id': '1', 'room_name': 'Cobalt' }, { 'id': '3', 'room_name': 'Copper' }]);
  });

  afterAll(() => {
    pool.end();
  });
});
