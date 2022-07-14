const { Router } = require('express');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, GitHubProfile } = require('../services/__mocks__/github');
const authenticate = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');
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
      const githubProfile = await GitHubProfile(token);

      let user = GithubUser.findByUsername(githubProfile.login);

      if(!user){
        user = await GithubUser.insert({
          username: githubProfile.login,
          email: githubProfile.email,
        });
      }
      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: 'one day',
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
  });
