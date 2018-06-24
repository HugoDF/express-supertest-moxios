const express = require('express');
const app = express();

const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient(process.env.REDIS_URL);

const redisClient = {
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client)
};

const hugo = require('./hugo');
const blobStore = require('./blob-store');


app.use(hugo());
app.use(blobStore(redisClient));

app.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});
