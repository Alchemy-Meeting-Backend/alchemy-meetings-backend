const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('Cohort Tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET/ should return a list of cohorts and zoom rooms', async () => {
    const res = await request(app).get('/api/v1/cohorts');
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

  it('POST/ should create a new cohort', async () => {
    const res = await request(app).post('/api/v1/cohorts').send({
      name: 'June 2022',
    });
    expect(res.body.name).toEqual('June 2022');
  });

  it('PUT/UPDATE/id should update a cohorts name', async () => {
    const res = await request(app)
      .put('/api/v1/cohorts/1')
      .send({ name: 'December 2022' });
    expect(res.body.name).toEqual('December 2022');
  });

  it('GET should return a cohort by id', async () => {
    const res = await request(app).get('/api/v1/cohorts/1');
    expect(res.body.name).toEqual('pending approval');
  });

  // it('GET should return all the zoom rooms and cohorts', async () => {
  //   const res = await request(app).get('/api/v1/cohorts');
  //   console.log('res:', res.body);

  //   expect(res.body.name).toEqual('feb 2022');
  // });

  afterAll(() => {
    pool.end();
  });
});
