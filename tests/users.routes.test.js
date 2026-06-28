/**
 * Unit tests for user route error handling
 *
 * These tests verify that the four previously broken error handlers
 * (which used `res.status(400).console.log(err)`) now correctly return
 * a JSON error response with a 400 status code.
 *
 * We test the Express router in isolation by mocking the User model,
 * so no MongoDB connection is required.
 */

const request = require('supertest');
const express = require('express');

// Mock the User model before requiring the router
jest.mock('../models/users.model');

// Build a minimal Express app that mounts only the users router
const usersRouter = require('../routes/users');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/users', usersRouter);
  return app;
}

describe('User routes — error handling', () => {
  let app;
  let User;

  beforeEach(() => {
    app = createApp();
    User = require('../models/users.model');
    jest.clearAllMocks();
  });

  describe('POST /users/lastlogindate/:id', () => {
    it('should return 400 JSON error when findById fails', async () => {
      User.findById = jest.fn().mockRejectedValue(new Error('DB connection lost'));

      const res = await request(app)
        .post('/users/lastlogindate/507f1f77bcf86cd799439011')
        .send({ today: '2026-06-28' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'DB connection lost');
    });

    it('should return 400 JSON error when save fails', async () => {
      const mockUser = {
        save: jest.fn().mockRejectedValue(new Error('Validation failed')),
      };
      User.findById = jest.fn().mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/users/lastlogindate/507f1f77bcf86cd799439011')
        .send({ today: '2026-06-28' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('POST /users/lastlogintime/:id', () => {
    it('should return 400 JSON error when findById fails', async () => {
      User.findById = jest.fn().mockRejectedValue(new Error('Not found'));

      const res = await request(app)
        .post('/users/lastlogintime/507f1f77bcf86cd799439011')
        .send({ time: '10:30' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Not found');
    });
  });

  describe('POST /users/logged/:id', () => {
    it('should return 400 JSON error when findById fails', async () => {
      User.findById = jest.fn().mockRejectedValue(new Error('Connection error'));

      const res = await request(app)
        .post('/users/logged/507f1f77bcf86cd799439011')
        .send({ logged: true });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Connection error');
    });
  });

  describe('POST /users/changeStatus/:id', () => {
    it('should return 400 JSON error when findById fails', async () => {
      User.findById = jest.fn().mockRejectedValue(new Error('Permission denied'));

      const res = await request(app)
        .post('/users/changeStatus/507f1f77bcf86cd799439011')
        .send({
          user: {
            administrator: false,
            allowedToEdit: false,
            allowedToDownload: false,
            entryPermit: false,
          },
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Permission denied');
    });

    it('should return 400 JSON error when save fails', async () => {
      const mockUser = {
        save: jest.fn().mockRejectedValue(new Error('Write conflict')),
        administrator: undefined,
        allowedToEdit: undefined,
        allowedToDownload: undefined,
        entryPermit: undefined,
      };
      User.findById = jest.fn().mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/users/changeStatus/507f1f77bcf86cd799439011')
        .send({
          user: {
            administrator: true,
            allowedToEdit: true,
            allowedToDownload: true,
            entryPermit: true,
          },
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Write conflict');
    });
  });
});
