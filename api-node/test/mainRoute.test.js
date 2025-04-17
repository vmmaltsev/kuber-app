const express = require('express');
const request = require('supertest');
const createMainRouter = require('../src/routes/main');

describe('main routes', () => {
  const mockService = {
    registerView: jest.fn().mockResolvedValue(),
    getStats: jest.fn().mockResolvedValue({ currentTime: 'now', requestCount: 2 })
  };
  const csrfProtection = (req, res, next) => next();
  const generateToken = () => 'test-csrf-token';

  const app = express();
  app.use(express.json());
  app.use('/', createMainRouter({ requestService: mockService, csrfProtection, generateToken }));

  it('GET /ping', async () => {
    const res = await request(app).get('/ping');
    expect(res.status).toBe(200);
    expect(res.text).toBe('pong');
  });

  it('GET /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.api).toBe('node');
    expect(res.body.requestCount).toBe(2);
  });

  it('GET /csrf-token', async () => {
    const res = await request(app).get('/csrf-token');
    expect(res.status).toBe(200);
    expect(res.body.csrfToken).toBe('test-csrf-token');
  });
}); 