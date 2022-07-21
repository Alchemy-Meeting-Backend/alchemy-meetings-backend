const { Router } = require('express');
const Zoomroom = require('../models/Zoomroom');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    const { cohort_id } = await GithubUser.getCohortId(req.user.id);

    const data = await Zoomroom.getAll(cohort_id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});
