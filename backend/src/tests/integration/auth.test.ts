// backend/tests/integration/auth.test.ts
import request from 'supertest';
import app from '../../src/app';

describe('Auth REST Endpoints Integration', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should login an existing user and return a JWT token', async () => {
    // Register first
    await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });

    // Attempt login
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });
});