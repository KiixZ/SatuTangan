import pool from '../config/database';
import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';

export class DatabaseService {
  /**
   * Execute a SELECT query and return rows
   */
  async query<T extends RowDataPacket>(
    sql: string,
    params?: any[]
  ): Promise<T[]> {
    const [rows] = await pool.query<T[]>(sql, params);
    return rows;
  }

  /**
   * Execute an INSERT, UPDATE, or DELETE query
   */
  async execute(sql: string, params?: any[]): Promise<ResultSetHeader> {
    const [result] = await pool.query<ResultSetHeader>(sql, params);
    return result;
  }

  /**
   * Execute multiple queries in a transaction
   */
  async transaction<T>(
    callback: (connection: PoolConnection) => Promise<T>
  ): Promise<T> {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }
}

export default new DatabaseService();
