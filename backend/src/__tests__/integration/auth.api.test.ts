import request from 'supertest';
import app from '../../index';
import { setupTestDatabase, cleanupTestData, closeTestDatabase } from './setup';
import pool from '../../config/database';

/**
 * Integration Tests: Authentication API Endpoints
 * 
 * Tests the complete authentication flow including:
 * - User registration
 * - Email verification
 * - Login
 * - Password reset
 */

describe('Authentication API Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@test.com',
          password: 'Test123!@#',
          full_name: 'Test User',
          phone_number: '081234567890',
          captcha: 'test-captcha'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('registered successfully');
      expect(response.body.data).toHaveProperty('userId');
    });

    it('should reject registration with existing email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@test.com',
          password: 'Test123!@#',
          full_name: 'Test User',
          phone_number: '081234567890',
          captcha: 'test-captcha'
        });

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@test.com',
          password: 'Test123!@#',
          full_name: 'Test User 2',
          phone_number: '081234567891',
          captcha: 'test-captcha'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@test.com',
          password: '123',
          full_name: 'Test User',
          phone_number: '081234567890',
          captcha: 'test-captcha'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a verified user for login tests
      const connection = await pool.getConnection();
      await connection.query(
        `INSERT INTO users (id, email, password, full_name, phone_number, role, is_email_verified) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          'test-user-id',
          'testlogin@test.com',
          '$2a$10$YourHashedPasswordHere',
          'Test Login User',
          '081234567890',
          'DONOR',
          true
        ]
      );
      connection.release();
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testlogin@test.com',
          password: 'Test123!@#'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe('testlogin@test.com');
    });

    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'Test123!@#'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testlogin@test.com',
          password: 'WrongPassword123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken: string;

    beforeEach(async () => {
      // Register and login to get token
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testme@test.com',
          password: 'Test123!@#',
          full_name: 'Test Me User',
          phone_number: '081234567890',
          captcha: 'test-captcha'
        });

      // Manually verify email
      const connection = await pool.getConnection();
      await connection.query(
        'UPDATE users SET is_email_verified = true WHERE email = ?',
        ['testme@test.com']
      );
      connection.release();

      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testme@test.com',
          password: 'Test123!@#'
        });

      authToken = loginResponse.body.data.token;
    });

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('testme@test.com');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
