const GithubUser = require('../models/GithubUser');

module.exports = async (req, res, next) => {
  try {

    const user = await GithubUser.getById(req.user.id);

    if (!user || user.cohort_id !== 2) {
      throw new Error('You cannot see this page!');
    }
  
    next();
  } catch (error) {
    error.status = 403;
    next(error);
  }
};
