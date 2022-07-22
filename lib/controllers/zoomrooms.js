const { Router } = require('express');
const Zoomroom = require('../models/Zoomroom');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { getParticipants } = require('../services/zoom');

module.exports = Router().get('/', authenticate, async (req, res, next) => {

  try {
    const { cohort_id } = await GithubUser.getCohortId(req.user.id);
    const data = await Zoomroom.getAll(cohort_id);
      
    //we take that data and then getParticipants
  
    // const participantData = [];

    // const booger = await getParticipants(data[0].meeting_id);
    // const booger2 = data[0].room_name;
    // participantData.push(booger2, booger);

    // for (let i = 0; i < data.length; i++) {
    //   if (i === data.length) { break; }
    //   const booger = await getParticipants(data[i].meeting_id);
    //   const booger2 = data[i].room_name;
    //   participantData.push(booger2, booger);
      
    // }

     
    // const oof = await Promise.all([
    //   getParticipants(data[0].meeting_id),
    //   getParticipants(data[1].meeting_id),
    //   getParticipants(data[2].meeting_id)
    // ]);
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
