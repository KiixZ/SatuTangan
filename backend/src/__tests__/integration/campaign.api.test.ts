import request from 'supertest';
import app from '../../index';
import { setupTestDatabase, cleanupTestData, closeTestDatabase, createTestUser, createTestCategory } from './setup';
import pool from '../../config/database';
import jwt from 'jsonwebtoken';

/**
 * Integration Tests: Campaign API Endpoints
 * 
 * Tests campaign management including:
 * - Campaign listing and filtering
 * - Campaign creation and updates
 * - Campaign status management
 * - Emergency campaign toggle
 */

describe('Campaign API Integration Tests', () => {
  let creatorToken: string;
  let creatorId: string;
  let categoryId: string;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    // Create test creator and category
    creatorId = await createTestUser('testcreator@test.com', 'CREATOR');
    categoryId = await createTestCategory('Test Category');
    
    // Generate token for creator
    creatorToken = jwt.sign(
      { userId: creatorId, role: 'CREATOR' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('GET /api/campaigns', () => {
    beforeEach(async () => {
      // Create test campaigns
      const connection = await pool.getConnection();
      
      for (let i = 1; i <= 3; i++) {
        await connection.query(
          `INSERT INTO campaigns (id, title, description, category_id, creator_id, target_amount, thumbnail_url, start_date, end_date, status, is_emergency) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            `test-campaign-${i}`,
            `Test Campaign ${i}`,
            `Description for campaign ${i}`,
            categoryId,
            creatorId,
            1000000 * i,
            '/uploads/test.jpg',
            new Date(),
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            'ACTIVE',
            i === 1 // First campaign is emergency
          ]
        );
      }
      
      connection.release();
    });

    it('should get list of active campaigns', async () => {
      const response = await request(app)
        .get('/api/campaigns')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.campaigns).toBeInstanceOf(Array);
      expect(response.body.data.campaigns.length).toBeGreaterThan(0);
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('should filter campaigns by category', async () => {
      const response = await request(app)
        .get('/api/campaigns')
        .query({ category: categoryId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.campaigns.every((c: any) => c.category_id === categoryId)).toBe(true);
    });

    it('should prioritize emergency campaigns', async () => {
      const response = await request(app)
        .get('/api/campaigns')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data.campaigns[0].is_emergency).toBe(true);
    });

    it('should search campaigns by title', async () => {
      const response = await request(app)
        .get('/api/campaigns')
        .query({ search: 'Campaign 1' });

      expect(response.status).toBe(200);
      expect(response.body.data.campaigns.length).toBeGreaterThan(0);
      expect(response.body.data.campaigns[0].title).toContain('Campaign 1');
    });
  });

  describe('GET /api/campaigns/:id', () => {
    let campaignId: string;

    beforeEach(async () => {
      const connection = await pool.getConnection();
      campaignId = `test-campaign-detail`;
      
      await connection.query(
        `INSERT INTO campaigns (id, title, description, category_id, creator_id, target_amount, collected_amount, thumbnail_url, start_date, end_date, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          campaignId,
          'Test Campaign Detail',
          'Detailed description',
          categoryId,
          creatorId,
          5000000,
          1000000,
          '/uploads/test.jpg',
          new Date(),
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          'ACTIVE'
        ]
      );
      
      connection.release();
    });

    it('should get campaign detail by id', async () => {
      const response = await request(app)
        .get(`/api/campaigns/${campaignId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(campaignId);
      expect(response.body.data.title).toBe('Test Campaign Detail');
      expect(response.body.data).toHaveProperty('category');
      expect(response.body.data).toHaveProperty('creator');
    });

    it('should return 404 for non-existent campaign', async () => {
      const response = await request(app)
        .get('/api/campaigns/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/campaigns', () => {
    it('should create a new campaign', async () => {
      const response = await request(app)
        .post('/api/campaigns')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({
          title: 'Test New Campaign',
          description: 'This is a new test campaign',
          category_id: categoryId,
          target_amount: 10000000,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          thumbnail_url: '/uploads/test.jpg'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('campaignId');
    });

    it('should reject campaign creation without authentication', async () => {
      const response = await request(app)
        .post('/api/campaigns')
        .send({
          title: 'Test New Campaign',
          description: 'This is a new test campaign',
          category_id: categoryId,
          target_amount: 10000000,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          thumbnail_url: '/uploads/test.jpg'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject campaign with invalid data', async () => {
      const response = await request(app)
        .post('/api/campaigns')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({
          title: '', // Empty title
          description: 'Description',
          category_id: categoryId,
          target_amount: -1000, // Negative amount
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/campaigns/:id/status', () => {
    let campaignId: string;

    beforeEach(async () => {
      const connection = await pool.getConnection();
      campaignId = `test-campaign-status`;
      
      await connection.query(
        `INSERT INTO campaigns (id, title, description, category_id, creator_id, target_amount, thumbnail_url, start_date, end_date, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          campaignId,
          'Test Campaign Status',
          'Description',
          categoryId,
          creatorId,
          1000000,
          '/uploads/test.jpg',
          new Date(),
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          'DRAFT'
        ]
      );
      
      connection.release();
    });

    it('should update campaign status', async () => {
      const response = await request(app)
        .patch(`/api/campaigns/${campaignId}/status`)
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({ status: 'ACTIVE' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('updated');
    });

    it('should reject invalid status', async () => {
      const response = await request(app)
        .patch(`/api/campaigns/${campaignId}/status`)
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({ status: 'INVALID_STATUS' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
