import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import request from 'supertest';

import { jest } from '@jest/globals';

import { errorHandler } from '../middleware/errorHandler.js';
import authRoutes from '../routes/authRoutes.js';
import productRoutes from '../routes/productRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use(errorHandler);

describe('Core API Tests', () => {
  beforeAll(async () => {
   
    jest.spyOn(mongoose, 'connect').mockImplementation(() => Promise.resolve());
  });

  afterAll(async () => {
    mongoose.disconnect();
    jest.restoreAllMocks();
  });

  describe('Auth Endpoints', () => {
    it('should return 400 when registering with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User' });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 when logging in with missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('Product Endpoints', () => {
    it('should return 401 when adding a product without auth', async () => {
      const res = await request(app)
        .post('/api/products/add')
        .send({
          productName: 'Laptop',
          purchaseDate: '2025-01-01',
          warrantyPeriod: 12
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toMatch(/Authentication required/i);
    });
  });
});
