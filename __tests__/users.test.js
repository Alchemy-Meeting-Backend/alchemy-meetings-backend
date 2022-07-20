const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const GithubUser = require('../lib/models/GithubUser');

jest.mock('../lib/services/github');

describe('User Tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const agent = request.agent(app);

  it('GET /github should return a list of users with authorizeAdmin', async () => {
    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    
    const res = await agent.get('/api/v1/github');

    const userData = await GithubUser.getAll();
    const expected = await userData.map((user) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        cohort_id: user.cohort_id,
        role: user.role,
      };
    });
    expect(res.body).toEqual(expected);
  });


  it('GET /github denies access to unauthenticated users trying to see list of all users', async () => {
    const res = await request(app).get('/api/v1/github');
    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('You must be signed in to continue!!??!');

  });

  // it('GET /github denies access to unauthorized users trying to see list of all users', async () => {
  //   const res = await request(app).get('/api/v1/github');
  //   expect(res.status).toEqual(403);
  //   expect(res.body.message).toEqual('You cannot see this page!');

  // });


  it('GET /github/:id should get a particular user', async () => {
    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    const res = await agent.get('/api/v1/github/1');
    const expected = await GithubUser.getById(1);
    expect(res.body).toEqual(expected);
  });


  it('GET /github/:id should deny access to non-authenticated users trying to get a particular user', async () => {
    const res = await request(app).get('/api/v1/github/1');
    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('You must be signed in to continue!!??!');
  });

  // it('GET /github/:id should deny access to non-authorized users trying to get a particular user', async () => {
  //   const res = await request(app).get('/api/v1/github/1');
  //   expect(res.status).toEqual(403);
  //   expect(res.body.message).toEqual('You cannot see this page!');
  // });


  it('PUT should update a users cohort_id', async () => {
    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    
    const res = await agent
      .put('/api/v1/github/1')
      .send({ cohort_id: 3, role: 'student' });

    const expected = await GithubUser.getById(1);
    expect(res.body).toEqual(expected);
  });

  it('DELETE should delete a user', async () => {
    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    const res = await agent.delete('/api/v1/github/1');
    expect(res.status).toEqual(200);
    expect(res.body.id).toEqual('1');
  });

  it('GET /github should return a list of pending users', async () => {
    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    const res = await agent.get('/api/v1/github/cohorts/1');
    expect(res.body).toEqual(
      expect.arrayContaining([
        {
          id: '2',
          username: 'Susan Brightness',
          email: 'susan@brightness.com',
          cohort_id: '1',
          role: 'Student',
        },
      ])
    );
  });

  afterAll(() => {
    pool.end();
  });
});
