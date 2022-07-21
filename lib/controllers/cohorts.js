const { Router } = require('express');
const Cohort = require('../models/Cohort');
const authenticate = require('../middleware/authenticate');
const authorizeAdmin = require('../middleware/authorizeAdmin');

module.exports = Router()
  .get('/', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
      const data = await Cohort.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  })

  .post('/', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
      const data = await Cohort.insert(req.body);
      console.log('req.body', req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
      const data = await Cohort.getById(req.params.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })

  .put('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
      const data = await Cohort.updateById(req.params.id, req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });
