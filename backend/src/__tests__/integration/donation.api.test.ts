import request from 'supertest';
import app from '../../index';
import { setupTestDatabase, cleanupTestData, closeTestDatabase, createTestUser, createTestCategory, createTestCampaign } from './setup';

/**
 * Integration Tests: Donation API Endpoints
 * 
 * Tests donation processing including:
 * - Donation creation
 * - Donation history
 * - Campaign donations list
 * - Prayer/review list
 */

describe('Donation API Integration Tests', () => {
  let creatorId: string;
  let categoryId: string;
  let campaignId: string;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    creatorId = await createTestUser('testcreator@test.com', 'CREATOR');
    categoryId = await createTestCategory('Test Category');
    campaignId = await createTestCampaign(creatorId, categoryId);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('POST /api/donations', () => {
    it('should create a new donation', async () => {
      const response = await request(app)
        .post('/api/donations')
        .send({
          campaign_id: campaignId,
          donor_name: 'Test Donor',
          donor_email: 'testdonor@test.com',
          donor_phone: '081234567890',
          amount: 100000,
          prayer: 'Semoga berkah',
          is_anonymous: false
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('donationId');
      expect(response.body.data).toHaveProperty('snap_token');
    });

    it('should create anonymous donation', async () => {
      const response = await request(app)
        .post('/api/donations')
        .send({
          campaign_id: campaignId,
          donor_name: 'Test Donor',
          donor_email: 'testdonor@test.com',
          donor_phone: '081234567890',
          amount: 50000,
          is_anonymous: true
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('donationId');
    });

    it('should reject donation with invalid amount', async () => {
      const response = await request(app)
        .post('/api/donations')
        .send({
          campaign_id: campaignId,
          donor_name: 'Test Donor',
          donor_email: 'testdonor@test.com',
          donor_phone: '081234567890',
          amount: -1000, // Negative amount
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject donation to non-existent campaign', async () => {
      const response = await request(app)
        .post('/api/donations')
        .send({
          campaign_id: 'non-existent-campaign',
          donor_name: 'Test Donor',
          donor_email: 'testdonor@test.com',
          donor_phone: '081234567890',
          amount: 100000,
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/campaigns/:id/donations', () => {
    beforeEach(async () => {
      // Create test donations
      await request(app)
        .post('/api/donations')
        .send({
          campaign_id: campaignId,
          donor_name: 'Donor 1',
          donor_email: 'testdonor1@test.com',
          donor_phone: '081234567890',
          amount: 100000,
          is_anonymous: false
        });

      await request(app)
        .post('/api/donations')
        .send({
          campaign_id: campaignId,
          donor_name: 'Donor 2',
          donor_email: 'testdonor2@test.com',
          donor_phone: '081234567891',
          amount: 200000,
          is_anonymous: true
        });
    });

    it('should get campaign donations list', async () => {
      const response = await request(app)
        .get(`/api/campaigns/${campaignId}/donations`)
        .query({ limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should hide donor name for anonymous donations', async () => {
      const response = await request(app)
        .get(`/api/campaigns/${campaignId}/donations`)
        .query({ limit: 10 });

      expect(response.status).toBe(200);
      const anonymousDonation = response.body.data.find((d: any) => d.is_anonymous);
      expect(anonymousDonation.donor_name).toBe('Hamba Allah');
    });
  });

  describe('GET /api/campaigns/:id/prayers', () => {
    beforeEach(async () => {
      // Create donations with prayers
      await request(app)
        .post('/api/donations')
        .send({
          campaign_id: campaignId,
          donor_name: 'Donor with Prayer',
          donor_email: 'testprayer@test.com',
          donor_phone: '081234567890',
          amount: 100000,
          prayer: 'Semoga berkah dan lancar',
          is_anonymous: false
        });
    });

    it('should get campaign prayers list', async () => {
      const response = await request(app)
        .get(`/api/campaigns/${campaignId}/prayers`)
        .query({ limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should only return donations with prayers', async () => {
      const response = await request(app)
        .get(`/api/campaigns/${campaignId}/prayers`)
        .query({ limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data.every((d: any) => d.prayer !== null)).toBe(true);
    });
  });

  describe('GET /api/donations/:id', () => {
    let donationId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/donations')
        .send({
          campaign_id: campaignId,
          donor_name: 'Test Donor',
          donor_email: 'testdonor@test.com',
          donor_phone: '081234567890',
          amount: 100000,
        });

      donationId = createResponse.body.data.donationId;
    });

    it('should get donation detail by id', async () => {
      const response = await request(app)
        .get(`/api/donations/${donationId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(donationId);
      expect(response.body.data).toHaveProperty('campaign');
    });

    it('should return 404 for non-existent donation', async () => {
      const response = await request(app)
        .get('/api/donations/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
