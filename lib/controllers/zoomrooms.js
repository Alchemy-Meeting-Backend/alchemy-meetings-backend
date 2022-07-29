const { Router } = require('express');
const Zoomroom = require('../models/Zoomroom');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { getParticipants } = require('../services/zoom');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    console.log('req.user.cohort_id', req.user.cohort_id);

    
    try {
      const { cohort_id } = await GithubUser.getCohortId(req.user.id);
      const data = await Zoomroom.getAll(cohort_id);
      
      const oof = await Promise.all(data.map(datum => getParticipants(datum.meeting_id))
      );
      console.log(oof, 'foop2');

      res.json(oof);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    const participants = await getParticipants(req.params.id);
    console.log(participants);
    res.json(participants);
  });
