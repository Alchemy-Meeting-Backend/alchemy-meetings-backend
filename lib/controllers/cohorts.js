const { Router } = require('express');
const Cohort = require('../models/Cohort');

module.exports = Router().get('/', async (req, res, next) => {
  try {
    const data = await Cohort.getAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
});
