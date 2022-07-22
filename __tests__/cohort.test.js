const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github', () => {
  return {
    exchangeCodeForToken: jest.fn((code) => `MOCK_TOKEN_FOR_CODE_${code}`),
    getGitHubProfile: jest.fn(),
  };
});
const github = require('../lib/services/github');

describe('Cohort Tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const agent = request.agent(app);

  it('GET/ should return a list of cohorts and zoom rooms', async () => {
    github.getGitHubProfile.mockImplementation(() => {
      return {
        login: 'someperson',
        email: 'fakeusername@faux.net',
        cohort_id: 2,
        role: 'student'
      };
    });
    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    
    const res = await agent.get('/api/v1/cohorts');

    expect(res.body).toEqual([
      {
        'id': '1',
        'name': 'pending approval',
        'rooms': []
      },
      {
        'id': '2',
        'name': 'staff',
        'rooms': [
          'Beryllium',
          'Brass',
          'Bronze',
          'Chrome',
          'Gold',
          'Iron',
          'Lithium',
          'Mercury',
          'Nickel',
          'Osmium',
          'Oxygen',
          'Lecture',
          'Atrium',
          'Cobalt',
          'Quiet Room',
          'Career Development Room',
          'Goodland',
          'Open Work Room',
          'Community Room',
          'Community Room',
          'Alumni Room',
          'Career Development Room',
          'Lecture',
          'Open Work Room',
          'Danis Room',
          'Atrium',
          'Quiet Room',
          'Zinc',
          'Xenon',
          'TA Room',
          'Vibranium',
          'Titanium',
          'TA Room',
          'TA Room 2',
          'Silver',
          'Mythril',
          'Alumni Room',
          'Cobalt',
          'Goodland',
          'Copper',
          'Danis Room',
          'Aluminum',
          'Alumni Room',
          'TA Room 2',
          'TA Room',
          'Copper',
        ]
      },
      {
        'id': '3',
        'name': 'alumni',
        'rooms': [
          'Community Room',
          'Alumni Room',
          'Career Development Room',
          'Open Work Room',
        ]
      },
      {
        'id': '4',
        'name': 'feb 2022',
        'rooms': [
          'Atrium',
          'Community Room',
          'Lithium',
          'Gold',
          'Cobalt',
          'Goodland',
          'Iron',
          'Copper',
          'Lecture',
          'TA Room',
          'Career Development Room',
          'TA Room 2',
          'Quiet Room',
          'Open Work Room'
        ]
      },
      {
        'id': '5',
        'name': 'jan 2022',
        'rooms': [
          'TA Room 2',
          'Brass',
          'Open Work Room',
          'Bronze',
          'TA Room',
          'Beryllium',
          'Career Development Room',
          'Quiet Room',
          'Community Room',
        ]
      },
      {
        'id': '6',
        'name': 'april 2022',
        'rooms': [
          'Zinc',
          'Goodland',
          'Silver',
          'Titanium',
          'Vibranium',
          'Xenon',
          'Career Development Room',
          'Community Room',
          'Open Work Room',
          'Quiet Room',
          'TA Room',
          'TA Room 2',
        ]
      },
      {
        'id': '7',
        'name': 'june 2022',
        'rooms': [
          'TA Room',
          'Open Work Room',
          'TA Room 2',
          'Osmium',
          'Nickel',
          'Community Room',
          'Chrome',
          'Quiet Room',
          'Goodland',
          'Career Development Room'
        ]
      },
      {
        'id': '8',
        'name': 'july 2022',
        'rooms': [
          'Aluminum',
          'TA Room 2',
          'Cobalt',
          'TA Room',
          'Quiet Room',
          'Open Work Room',
          'Community Room',
          'Career Development Room',
          'Danis Room',
          'Mythril',
          'Oxygen',
          'Mercury'
        ]
      }
    ]
    );
  });




  it('GET/ should restrict access to non-authenticated users', async () => {
    const res = await request(app).get('/api/v1/cohorts');

    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('You must be signed in to continue!!??!');
  });

  it('GET/ should restrict access to non-authorized users', async () => {
    const res = await request(app).get('/api/v1/cohorts');
    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('You must be signed in to continue!!??!');
  });


  it('POST/ should create a new cohort', async () => {
    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    const res = await agent.post('/api/v1/cohorts').send({
      name: 'June 2022',
    });
    expect(res.body.name).toEqual('June 2022');
  });

  it('POST/ should denying access to non-authenticated users trying to create a new cohort', async () => {
    const res = await request(app).post('/api/v1/cohorts').send({
      name: 'June 2022',
    });
    expect(res.body.message).toEqual('You must be signed in to continue!!??!');
    expect(res.status).toEqual(401);
  });

  it('POST/ should denying access to non-authorized users trying to create a new cohort', async () => {
    github.getGitHubProfile.mockImplementation(() => {
      return {
        login: 'someperson',
        email: 'fakeusername@faux.net',
        cohort_id: 3,
        role: 'student'
      };
    });

    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    const res = await agent.post('/api/v1/cohorts').send({
      name: 'June 2022',
    });
    expect(res.body.message).toEqual('You cannot see this page!');
    expect(res.status).toEqual(403);
  });



  it('PUT/UPDATE/id should update a cohorts name', async () => {
    github.getGitHubProfile.mockImplementation(() => {
      return {
        login: 'someperson',
        email: 'fakeusername@faux.net',
        cohort_id: 2,
        role: 'student'
      };
    });

    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    const res = await agent
      .put('/api/v1/cohorts/1')
      .send({ name: 'December 2022' });
    expect(res.body.name).toEqual('December 2022');
  });



  it('PUT/UPDATE/id should deny access to non-authenticated user trying to update a cohorts name', async () => {
    const res = await request(app)
      .put('/api/v1/cohorts/1')
      .send({ name: 'December 2022' });
    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('You must be signed in to continue!!??!');
  });


  it('PUT/UPDATE/id should deny access to non-authorized user trying to update a cohorts name', async () => {
    github.getGitHubProfile.mockImplementation(() => {
      return {
        login: 'someperson',
        email: 'fakeusername@faux.net',
        cohort_id: 3,
        role: 'student'
      };
    });

    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    const res = await agent
      .put('/api/v1/cohorts/1')
      .send({ name: 'December 2022' });
    expect(res.status).toEqual(403);
    expect(res.body.message).toEqual('You cannot see this page!');
  });


  it('GET should return a cohort by id', async () => {
    github.getGitHubProfile.mockImplementation(() => {
      return {
        login: 'someperson',
        email: 'fakeusername@faux.net',
        cohort_id: 2,
        role: 'student'
      };
    });

    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    const res = await agent.get('/api/v1/cohorts/1');
    expect(res.body.name).toEqual('pending approval');
  });


  it('GET should deny access to non-authenticated users trying to see a cohort by id', async () => {
    const res = await request(app).get('/api/v1/cohorts/1');
    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('You must be signed in to continue!!??!');
  });


  it('GET should deny access to non-authorized users trying to see a cohort by id', async () => {
    github.getGitHubProfile.mockImplementation(() => {
      return {
        login: 'someperson',
        email: 'fakeusername@faux.net',
        cohort_id: 3,
        role: 'student'
      };
    });

    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    const res = await agent.get('/api/v1/cohorts/1');
    expect(res.status).toEqual(403);
    expect(res.body.message).toEqual('You cannot see this page!');
  });

  afterAll(() => {
    pool.end();
  });
});
