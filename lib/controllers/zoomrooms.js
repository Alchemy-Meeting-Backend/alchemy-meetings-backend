const { Router } = require('express');
const Zoomroom = require('../models/Zoomroom');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { getParticipants } = require('../services/zoom');

module.exports = Router()

  .get('/', authenticate, async (req, res, next) => {
    try {
      const { cohort_id } = await GithubUser.getCohortId(req.user.id);
      const data = await Zoomroom.getAll(cohort_id);
  
      const oof = await Promise.all(data.map(datum => getParticipants(datum.meeting_id))
      );

      res.json(oof);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const participants = await getParticipants(req.params.id);
      res.json(participants);
    } catch (error) {
      next(error);
    }
  });
