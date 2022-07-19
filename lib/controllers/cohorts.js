const { Router } = require('express');
const Cohort = require('../models/Cohort');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const data = await Cohort.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  })

  .post('/', async (req, res, next) => {
    try {
      const data = await Cohort.insert(req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })

  // .get('/', async (req, res, next) => {
  //   console.log('im here in the controller');
  //   try {
  //     const data = await Cohort.getZooms();
  //     res.json(data);
  //   } catch (error) {
  //     next(error);
  //   }
  // })

  .get('/:id', async (req, res, next) => {
    try {
      const data = await Cohort.getById(req.params.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })

  .put('/:id', async (req, res, next) => {
    try {
      const data = await Cohort.updateById(req.params.id, req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });
