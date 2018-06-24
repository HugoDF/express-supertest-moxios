const blobStore = require('./blob-store');
const express = require('express');
const moxios = require('moxios');
const request = require('supertest');

const initBlobStore = (
    mockRedisClient = {
        getAsync: jest.fn(() => Promise.resolve()),
        setAsync: jest.fn(() => Promise.resolve())
    }
) => {
    const app = express();
    app.use(blobStore(mockRedisClient));
    return app;
}

describe('GET /store/:key with params', () => {
    test('It should call redisClient.setAsync with key route parameter as key and stringified params as value', async () => {
        const mockRedisClient = {
            setAsync: jest.fn(() => Promise.resolve())
        };
        const app = initBlobStore(mockRedisClient);
        await request(app).get('/store/my-key?hello=world&foo=bar');
        expect(mockRedisClient.setAsync).toHaveBeenCalledWith(
            'my-key',
            '{\"hello\":\"world\",\"foo\":\"bar\"}'
        );
    });
});
describe('GET /:key', () => {
    test('It should call redisClient.getAsync with key route parameter as key', async () => {
        const mockRedisClient = {
            getAsync: jest.fn(() => Promise.resolve('{}'))
        };
        const app = initBlobStore(mockRedisClient);
        await request(app).get('/my-key');
        expect(mockRedisClient.getAsync).toHaveBeenCalledWith(
            'my-key',
        );
    });
    test('It should return output of redisClient.getAsync with key route parameter as key', async () => {
        const mockRedisClient = {
            getAsync: jest.fn(() => Promise.resolve('{}'))
        };
        const app = initBlobStore(mockRedisClient);
        const response = await request(app).get('/my-key');
        expect(response.body).toEqual({});
    });
});