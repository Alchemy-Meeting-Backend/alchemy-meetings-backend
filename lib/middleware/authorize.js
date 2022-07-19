const Zoomroom = require('../models/Zoomroom');

module.exports = async (req, res, next) => {
  try {
    const zoomRoom = await Zoomroom.getAll();
    console.log(zoomRoom, 'ZOOM ROOM');
    if (!zoomRoom || zoomRoom.id !== req.user.id) {
      throw new Error('You cannot see this page');
    }
    next();
  } catch (error) {
    error.status = 403;
    next(error);
  }
};
