const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');


jest.mock('../lib/services/github');

describe('Cohort Tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const agent = request.agent(app);

  it('GET/ should return a list of cohorts and zoom rooms', async () => {
    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    
    const res = await agent.get('/api/v1/cohorts');

    expect(res.body).toEqual([
      {
        'id': '1',
        'name': 'pending approval',
        'rooms':[],
      },
      {
        'id': '2',
        'name': 'staff',
        'rooms':[
          'Goodland',
          'Copper',
          'Cobalt',
        ],
      },
      {
        'id': '3',
        'name': 'alumni',
        'rooms':[],
      },
      {
        'id': '4',
        'name': 'feb 2022',
        'rooms':[
          'Goodland',
          'Cobalt',
        ],
      },
      {
        'id': '5',
        'name': 'jan 2022',
        'rooms':[],
      },
    ]
    );
  });


  it('GET/ should restrict access to non-authenticated users', async () => {
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

  it('PUT/UPDATE/id should update a cohorts name', async () => {
    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    const res = await agent
      .put('/api/v1/cohorts/1')
      .send({ name: 'December 2022' });
    expect(res.body.name).toEqual('December 2022');
  });

  it('GET should return a cohort by id', async () => {
    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    const res = await agent.get('/api/v1/cohorts/1');
    expect(res.body.name).toEqual('pending approval');
  });

  afterAll(() => {
    pool.end();
  });
});
