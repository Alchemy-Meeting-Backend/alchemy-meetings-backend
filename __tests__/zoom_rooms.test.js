const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github'); 

describe('Zoom Room Tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const agent = request.agent(app);

  it.only('GET/ should display a list of zoomrooms associated with a users cohort id for authenticated users', async () => {
    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
      
    const res = await agent.get('/api/v1/zoomrooms');

    expect(res.body[0]).toEqual(
      { id: '1', meeting_id: '9040374817', room_name: 'Cobalt' },
    );
  });


  it('GET/ should deny access to non-authenticated users attempting to see a list of zoomrooms by a users cohort id', async () => {
    const res = await request(app).get('/api/v1/zoomrooms');

    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('You must be signed in to continue!!??!');
  });


  it('GET/ should display no zoomrooms for pending users, who have a cohort id of 1', async () => {
    const userResponse = await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    await agent
      .put(`/api/v1/github/${userResponse.body.id}`)
      .send({ cohort_id: 1 });

    await agent
      .delete('/api/v1/github/sessions');

    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    const res = await agent.get('/api/v1/zoomrooms');
    expect(res.body).toEqual([]);
  });


  it.skip('GET/ should display a list of all zoomrooms for staff, who have a cohort id of 2', async () => {
    const userResponse = await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    const res = await agent.get('/api/v1/zoomrooms');
    console.log(res.text, 'loog');

    expect(res.body[0]).toEqual({ id: '1', meeting_id: '9040374817', room_name: 'Cobalt' });
  });
  

  // it('GET/ should display a list of all community zoomrooms for alumni, who have a cohort id of 3', async () => {
  //   const userResponse = await agent
  //     .get('/api/v1/github/callback?code=42')
  //     .redirects(1);
    
  //   await agent
  //     .put(`/api/v1/github/${userResponse.body.id}`)
  //     .send({ cohort_id: 3 });

  //   await agent
  //     .delete('/api/v1/github/sessions');

  //   await agent
  //     .get('/api/v1/github/callback?code=42')
  //     .redirects(1);
  //   const res = await agent.get('/api/v1/zoomrooms');
  //   expect(res.body).toEqual([]);
  // });

  afterAll(() => {
    pool.end();
  });
});
