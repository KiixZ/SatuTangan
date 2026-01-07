import pool from '../../config/database';
import { logger } from '../../utils/logger';

/**
 * Integration Test Setup
 * 
 * This file provides utilities for setting up and tearing down integration tests.
 * It manages test database connections and cleanup.
 */

export const setupTestDatabase = async () => {
  try {
    // Test database connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    logger.info('Test database connected successfully');
    return true;
  } catch (error) {
    logger.error('Test database connection failed', error);
    return false;
  }
};

export const cleanupTestData = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Clean up test data in reverse order of dependencies
    await connection.query('DELETE FROM webhook_logs WHERE order_id LIKE "TEST_%"');
    await connection.query('DELETE FROM withdrawals WHERE id LIKE "test-%"');
    await connection.query('DELETE FROM reports WHERE reporter_email LIKE "test%@test.com"');
    await connection.query('DELETE FROM donations WHERE donor_email LIKE "test%@test.com"');
    await connection.query('DELETE FROM campaign_updates WHERE campaign_id LIKE "test-%"');
    await connection.query('DELETE FROM campaign_photos WHERE campaign_id LIKE "test-%"');
    await connection.query('DELETE FROM campaigns WHERE title LIKE "Test Campaign%"');
    await connection.query('DELETE FROM banners WHERE title LIKE "Test Banner%"');
    await connection.query('DELETE FROM categories WHERE name LIKE "Test Category%"');
    await connection.query('DELETE FROM creator_verifications WHERE user_id LIKE "test-%"');
    await connection.query('DELETE FROM users WHERE email LIKE "test%@test.com"');
    
    connection.release();
    logger.info('Test data cleaned up successfully');
  } catch (error) {
    logger.error('Test data cleanup failed', error);
    throw error;
  }
};

export const closeTestDatabase = async () => {
  try {
    await pool.end();
    logger.info('Test database connection closed');
  } catch (error) {
    logger.error('Failed to close test database connection', error);
  }
};

// Helper to create test user
export const createTestUser = async (email: string, role: 'DONOR' | 'CREATOR' | 'ADMIN' = 'DONOR') => {
  const connection = await pool.getConnection();
  try {
    const userId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await connection.query(
      `INSERT INTO users (id, email, password, full_name, phone_number, role, is_email_verified) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, email, '$2a$10$hashedpassword', 'Test User', '081234567890', role, true]
    );
    return userId;
  } finally {
    connection.release();
  }
};

// Helper to create test category
export const createTestCategory = async (name: string) => {
  const connection = await pool.getConnection();
  try {
    const categoryId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await connection.query(
      `INSERT INTO categories (id, name, description) VALUES (?, ?, ?)`,
      [categoryId, name, 'Test category description']
    );
    return categoryId;
  } finally {
    connection.release();
  }
};

// Helper to create test campaign
export const createTestCampaign = async (creatorId: string, categoryId: string, title: string = 'Test Campaign') => {
  const connection = await pool.getConnection();
  try {
    const campaignId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await connection.query(
      `INSERT INTO campaigns (id, title, description, category_id, creator_id, target_amount, thumbnail_url, start_date, end_date, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        campaignId,
        title,
        'Test campaign description',
        categoryId,
        creatorId,
        1000000,
        '/uploads/test.jpg',
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        'ACTIVE'
      ]
    );
    return campaignId;
  } finally {
    connection.release();
  }
};
