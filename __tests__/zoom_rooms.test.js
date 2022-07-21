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

  it('GET/ should display a list of zoomrooms associated with a users cohort id for authenticated users', async () => {
    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
      
    const res = await agent.get('/api/v1/zoomrooms');

    expect(res.body).toEqual([
      { id: '1', room_name: 'Cobalt' },
      { id: '2', room_name: 'Goodland' },
      { id: '3', room_name: 'Copper' }
    ]);
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
    expect(res.body).toEqual([
      {
        'id': '1',
        'room_name': 'Cobalt'
      },
      {
        'id': '2',
        'room_name': 'Goodland'
      },
      {
        'id': '3',
        'room_name': 'Copper'
      },
      {
        'id': '4',
        'room_name': 'Aluminum'
      },
      {
        'id': '5',
        'room_name': 'Beryllium'
      },
      {
        'id': '6',
        'room_name': 'Brass'
      },
      {
        'id': '7',
        'room_name': 'Bronze'
      },
      {
        'id': '8',
        'room_name': 'Chrome'
      },
      {
        'id': '9',
        'room_name': 'Gold'
      },
      {
        'id': '10',
        'room_name': 'Iron'
      },
      {
        'id': '11',
        'room_name': 'Lithium'
      },
      {
        'id': '12',
        'room_name': 'Mercury'
      },
      {
        'id': '13',
        'room_name': 'Nickel'
      },
      {
        'id': '14',
        'room_name': 'Osmium'
      },
      {
        'id': '15',
        'room_name': 'Oxygen'
      },
      {
        'id': '16',
        'room_name': 'Mythril'
      },
      {
        'id': '17',
        'room_name': 'Silver'
      },
      {
        'id': '18',
        'room_name': 'Titanium'
      },
      {
        'id': '19',
        'room_name': 'Vibranium'
      },
      {
        'id': '20',
        'room_name': 'Xenon'
      },
      {
        'id': '21',
        'room_name': 'Zinc'
      },
      {
        'id': '22',
        'room_name': 'Atrium'
      },
      {
        'id': '23',
        'room_name': 'Danis Room'
      },
      {
        'id': '24',
        'room_name': 'Lecture'
      },
      {
        'id': '25',
        'room_name': 'Career Development Room'
      },
      {
        'id': '26',
        'room_name': 'Community Room'
      },
      {
        'id': '27',
        'room_name': 'Open Work Room'
      },
      {
        'id': '28',
        'room_name': 'Quiet Room'
      },
      {
        'id': '29',
        'room_name': 'TA Room'
      },
      {
        'id': '30',
        'room_name': 'TA Room 2'
      },
      {
        'id': '31',
        'room_name': 'Alumni Room'
      }
    ]);
  });
  

  it('GET/ should display a list of all community zoomrooms for alumni, who have a cohort id of 3', async () => {
    const userResponse = await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    
    await agent
      .put(`/api/v1/github/${userResponse.body.id}`)
      .send({ cohort_id: 3 });

    await agent
      .delete('/api/v1/github/sessions');

    await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    const res = await agent.get('/api/v1/zoomrooms');
    expect(res.body).toEqual([
      {
        'id': '25',
        'room_name': 'Career Development Room',     
      },
      {
        'id': '26',
        'room_name': 'Community Room',
      },
      {
        'id': '27',
        'room_name': 'Open Work Room',
      },
      {
        'id': '31',
        'room_name': 'Alumni Room',
      },
    ]);
  });

  afterAll(() => {
    pool.end();
  });
});
