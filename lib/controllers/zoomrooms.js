const { Router } = require('express');
const Zoomroom = require('../models/Zoomroom');
const authenticate = require('../middleware/authenticate');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    const data = await Zoomroom.getAll(req.user.cohort_id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});
