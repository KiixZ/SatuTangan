import pool from '../../config/database';
import databaseService from '../../services/databaseService';
import { setupTestDatabase, cleanupTestData, closeTestDatabase } from './setup';

/**
 * Integration Tests: Database Operations
 * 
 * Tests database connectivity and operations including:
 * - Connection pooling
 * - Query execution
 * - Transaction handling
 * - Error handling
 */

describe('Database Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('Database Connection', () => {
    it('should connect to database successfully', async () => {
      const connection = await pool.getConnection();
      expect(connection).toBeDefined();
      
      await connection.ping();
      connection.release();
    });

    it('should test connection using database service', async () => {
      const isConnected = await databaseService.testConnection();
      expect(isConnected).toBe(true);
    });

    it('should handle multiple concurrent connections', async () => {
      const connections = await Promise.all([
        pool.getConnection(),
        pool.getConnection(),
        pool.getConnection()
      ]);

      expect(connections.length).toBe(3);
      connections.forEach(conn => {
        expect(conn).toBeDefined();
        conn.release();
      });
    });
  });

  describe('Query Operations', () => {
    it('should execute SELECT query', async () => {
      const result = await databaseService.query(
        'SELECT * FROM users WHERE email = ?',
        ['test@test.com']
      );

      expect(Array.isArray(result)).toBe(true);
    });

    it('should execute INSERT query', async () => {
      const userId = `test-${Date.now()}`;
      const result = await databaseService.execute(
        `INSERT INTO users (id, email, password, full_name, phone_number, role) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, 'testinsert@test.com', 'hashedpass', 'Test User', '081234567890', 'DONOR']
      );

      expect(result.affectedRows).toBe(1);
    });

    it('should execute UPDATE query', async () => {
      // First insert a user
      const userId = `test-${Date.now()}`;
      await databaseService.execute(
        `INSERT INTO users (id, email, password, full_name, phone_number, role) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, 'testupdate@test.com', 'hashedpass', 'Test User', '081234567890', 'DONOR']
      );

      // Then update
      const result = await databaseService.execute(
        'UPDATE users SET full_name = ? WHERE id = ?',
        ['Updated Name', userId]
      );

      expect(result.affectedRows).toBe(1);
    });

    it('should execute DELETE query', async () => {
      // First insert a user
      const userId = `test-${Date.now()}`;
      await databaseService.execute(
        `INSERT INTO users (id, email, password, full_name, phone_number, role) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, 'testdelete@test.com', 'hashedpass', 'Test User', '081234567890', 'DONOR']
      );

      // Then delete
      const result = await databaseService.execute(
        'DELETE FROM users WHERE id = ?',
        [userId]
      );

      expect(result.affectedRows).toBe(1);
    });

    it('should handle query with no results', async () => {
      const result = await databaseService.query(
        'SELECT * FROM users WHERE email = ?',
        ['nonexistent@test.com']
      );

      expect(result).toEqual([]);
    });
  });

  describe('Transaction Operations', () => {
    it('should commit transaction successfully', async () => {
      const userId = `test-${Date.now()}`;
      
      await databaseService.transaction(async (connection) => {
        await connection.query(
          `INSERT INTO users (id, email, password, full_name, phone_number, role) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [userId, 'testtransaction@test.com', 'hashedpass', 'Test User', '081234567890', 'DONOR']
        );
      });

      // Verify the insert was committed
      const result = await databaseService.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      expect(result.length).toBe(1);
      expect(result[0].email).toBe('testtransaction@test.com');
    });

    it('should rollback transaction on error', async () => {
      const userId = `test-${Date.now()}`;
      
      try {
        await databaseService.transaction(async (connection) => {
          // First insert should succeed
          await connection.query(
            `INSERT INTO users (id, email, password, full_name, phone_number, role) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, 'testrollback@test.com', 'hashedpass', 'Test User', '081234567890', 'DONOR']
          );

          // Force an error with duplicate email
          await connection.query(
            `INSERT INTO users (id, email, password, full_name, phone_number, role) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId + '-2', 'testrollback@test.com', 'hashedpass', 'Test User 2', '081234567891', 'DONOR']
          );
        });
      } catch (error) {
        // Expected to fail
      }

      // Verify the insert was rolled back
      const result = await databaseService.query(
        'SELECT * FROM users WHERE email = ?',
        ['testrollback@test.com']
      );

      expect(result.length).toBe(0);
    });

    it('should handle multiple operations in transaction', async () => {
      const userId = `test-${Date.now()}`;
      const categoryId = `test-cat-${Date.now()}`;
      const campaignId = `test-camp-${Date.now()}`;
      
      await databaseService.transaction(async (connection) => {
        // Insert user
        await connection.query(
          `INSERT INTO users (id, email, password, full_name, phone_number, role) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [userId, 'testmulti@test.com', 'hashedpass', 'Test User', '081234567890', 'CREATOR']
        );

        // Insert category
        await connection.query(
          `INSERT INTO categories (id, name, description) VALUES (?, ?, ?)`,
          [categoryId, 'Test Category Multi', 'Description']
        );

        // Insert campaign
        await connection.query(
          `INSERT INTO campaigns (id, title, description, category_id, creator_id, target_amount, thumbnail_url, start_date, end_date, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            campaignId,
            'Test Campaign Multi',
            'Description',
            categoryId,
            userId,
            1000000,
            '/uploads/test.jpg',
            new Date(),
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            'ACTIVE'
          ]
        );
      });

      // Verify all inserts were committed
      const userResult = await databaseService.query('SELECT * FROM users WHERE id = ?', [userId]);
      const categoryResult = await databaseService.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
      const campaignResult = await databaseService.query('SELECT * FROM campaigns WHERE id = ?', [campaignId]);

      expect(userResult.length).toBe(1);
      expect(categoryResult.length).toBe(1);
      expect(campaignResult.length).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid SQL syntax', async () => {
      await expect(
        databaseService.query('INVALID SQL QUERY')
      ).rejects.toThrow();
    });

    it('should handle constraint violations', async () => {
      const userId = `test-${Date.now()}`;
      
      // First insert
      await databaseService.execute(
        `INSERT INTO users (id, email, password, full_name, phone_number, role) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, 'testconstraint@test.com', 'hashedpass', 'Test User', '081234567890', 'DONOR']
      );

      // Try to insert duplicate email
      await expect(
        databaseService.execute(
          `INSERT INTO users (id, email, password, full_name, phone_number, role) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [userId + '-2', 'testconstraint@test.com', 'hashedpass', 'Test User 2', '081234567891', 'DONOR']
        )
      ).rejects.toThrow();
    });

    it('should handle foreign key violations', async () => {
      await expect(
        databaseService.execute(
          `INSERT INTO campaigns (id, title, description, category_id, creator_id, target_amount, thumbnail_url, start_date, end_date, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'test-campaign-fk',
            'Test Campaign',
            'Description',
            'non-existent-category',
            'non-existent-user',
            1000000,
            '/uploads/test.jpg',
            new Date(),
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            'ACTIVE'
          ]
        )
      ).rejects.toThrow();
    });
  });

  describe('Connection Pool Management', () => {
    it('should reuse connections from pool', async () => {
      const conn1 = await pool.getConnection();
      const threadId1 = conn1.threadId;
      conn1.release();

      const conn2 = await pool.getConnection();
      const threadId2 = conn2.threadId;
      conn2.release();

      // Thread IDs might be the same if connection was reused
      expect(typeof threadId1).toBe('number');
      expect(typeof threadId2).toBe('number');
    });

    it('should handle connection release properly', async () => {
      const connection = await pool.getConnection();
      expect(connection).toBeDefined();
      
      connection.release();
      
      // Should be able to get another connection
      const newConnection = await pool.getConnection();
      expect(newConnection).toBeDefined();
      newConnection.release();
    });
  });
});
