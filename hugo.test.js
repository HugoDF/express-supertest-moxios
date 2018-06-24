const hugo = require('./hugo');
const express = require('express');
const moxios = require('moxios');
const request = require('supertest');

const initHugo = () => {
  const app = express();
  app.use(hugo());
  return app;
}

describe('GET /hugo', () => {
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
  });
  test('It should fetch HugoDF from GitHub', async () => {
    moxios.stubRequest(/api.github.com\/users/, {
      status: 200,
      response: {
        blog: 'https://codewithhugo.com',
        location: 'London',
        bio: 'Developer, JavaScript',
        public_repos: 39,
      }
    })
    const app = initHugo();
    await request(app).get('/hugo');
    expect(moxios.requests.mostRecent().url).toBe('https://api.github.com/users/HugoDF');
  });
  test('It should 200 and return a transformed version of GitHub response', async () => {
    moxios.stubRequest(/api.github.com\/users/, {
      status: 200,
      response: {
        blog: 'https://codewithhugo.com',
        location: 'London',
        bio: 'Developer, JavaScript',
        public_repos: 39,
      }
    });
    const app = initHugo();
    const res = await request(app).get('/hugo');
    expect(res.body).toEqual({
      blog: 'https://codewithhugo.com',
        location: 'London',
        bio: 'Developer, JavaScript',
        publicRepos: 39,
    });
  });
});