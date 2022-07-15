const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGitHubProfile } = require('../services/github');

const OneDayMS = 1000 * 60 * 60 * 24;

module.exports = Router()
.get('/login', async (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })

  .get('/callback', async (req, res, next) => {
    try {
      const { code } = req.query;
      const token = await exchangeCodeForToken(code);
      const githubProfile = await getGitHubProfile(token);

      let user = await GithubUser.findByUsername(githubProfile.login);

      if(!user){
        user = await GithubUser.insert({
          username: githubProfile.login,
          email: githubProfile.email,
          role: githubProfile.role,
          cohort_id: githubProfile.cohort_id,
        });
      }
      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: OneDayMS,
        })
        .redirect('/api/v1/github/dashboard');

      } catch(e) {
      next(e);
    }
  })
  
  .get('/dashboard', authenticate, async (req, res) => {
    res.json(req.user);
  })

  .delete('/sessions', (req, res) => {
    res
    .clearCookie(process.env.COOKIE_NAME)
    .json({ success: true, message: 'Signed out successfully!' });
  })
  .get('/', async (req, res, next) => {
    try {
      const userInfo = await GithubUser.getAll();
      res.json(userInfo);
    } catch (error) {
      next(error);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const userInfo = await GithubUser.getById(req.params.id);
      res.json(userInfo);
    } catch (error) {
      next(error);
    }
  });
