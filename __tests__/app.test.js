const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github'); 

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('it should redirect the user to github for oauth login', async () => {
    const res = await request(app).get('/api/v1/github/login');
    
    expect(res.header.location).toMatch(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_`
    );
  });

  it('should login and redirect user to /api/v1/github/dashboard', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
  
    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'someperson',
      email: 'fakeusername@faux.net',
      cohort_id: 1,
      role: 'student',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('should delete the cookie to log out the user', async () => {
    const res = await request(app)
      .delete('/api/v1/github/sessions');
    expect(res.body.message).toEqual('Signed out successfully!');
  });

  
  ///////if time allows, write test for verifying new user are assigned cohort_id === 1

  // it('should return a new user with cohort_id of 1', async () => {
  //   const res = await request
  //     .agent(app)
  //     .get(`/api/v1/github/callback?${code}`)
  //     .redirects(1);
  
  //   expect(res.body).toEqual({
  //     id: expect.any(String),
  //     username: 'someperson',
  //     email: 'fakeusername@faux.net',
  //     cohort_id: 4,
  //     role: 'student',
  //     iat: expect.any(Number),
  //     exp: expect.any(Number),
  //   });
  // });


  afterAll(() => {
    pool.end();
  });
});
