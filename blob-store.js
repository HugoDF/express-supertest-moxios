const { Router } = require('express');

module.exports = (redisClient, router = new Router()) => {
    router.get('/store/:key', async (req, res) => {
        const { key } = req.params;
        const value = req.query;
        await redisClient.setAsync(key, JSON.stringify(value));
        return res.send('Success');
    });
    router.get('/:key', async (req, res) => {
        const { key } = req.params;
        const rawData = await redisClient.getAsync(key);
        return res.json(JSON.parse(rawData));
    });
    return router;
};