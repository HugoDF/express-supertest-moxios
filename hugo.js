const { Router } = require('express');
const axios = require('axios');

module.exports = (router = new Router()) => {
  router.get('/hugo', async (req, res) => {
    const { data: userData } = await axios.get('https://api.github.com/users/HugoDF');
    const {
      blog,
      location,
      bio,
      public_repos,
    } = userData
    return res.json({
      blog,
      location,
      bio,
      publicRepos: public_repos,
    });
  });
  return router;
};
