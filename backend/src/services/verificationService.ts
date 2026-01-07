import { v4 as uuidv4 } from 'uuid';
import databaseService from './databaseService';
import { RowDataPacket } from 'mysql2';

interface CreatorVerification extends RowDataPacket {
  id: string;
  user_id: string;
  full_name: string;
  ktp_name: string;
  ktp_number: string;
  ktp_photo_url: string;
  bank_account_photo_url: string;
  account_number: string;
  bank_name: string;
  terms_photo_url: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason: string | null;
  warning_count: number;
  created_at: Date;
  updated_at: Date;
}

interface SubmitVerificationData {
  userId: string;
  full_name: string;
  ktp_name: string;
  ktp_number: string;
  ktp_photo_url: string;
  bank_account_photo_url: string;
  account_number: string;
  bank_name: string;
  terms_photo_url: string;
}

interface ApproveRejectData {
  verificationId: string;
  status: 'APPROVED' | 'REJECTED';
  rejection_reason?: string;
}

export class VerificationService {
  /**
   * Submit verification request
   */
  async submitVerification(data: SubmitVerificationData): Promise<string> {
    const {
      userId,
      full_name,
      ktp_name,
      ktp_number,
      ktp_photo_url,
      bank_account_photo_url,
      account_number,
      bank_name,
      terms_photo_url,
    } = data;

    // Check if user exists
    const users = await databaseService.query<RowDataPacket>(
      'SELECT id, role FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      throw new Error('User not found');
    }

    // Check if user already has a verification request
    const existingVerifications = await databaseService.query<CreatorVerification>(
      'SELECT id, status FROM creator_verifications WHERE user_id = ?',
      [userId]
    );

    if (existingVerifications.length > 0) {
      const existing = existingVerifications[0];
      if (existing.status === 'PENDING') {
        throw new Error('Verification request already pending');
      }
      if (existing.status === 'APPROVED') {
        throw new Error('User already verified as creator');
      }
      // If rejected, allow resubmission by updating the existing record
      const verificationId = existing.id;
      await databaseService.execute(
        `UPDATE creator_verifications 
         SET full_name = ?, ktp_name = ?, ktp_number = ?, ktp_photo_url = ?,
             bank_account_photo_url = ?, account_number = ?, bank_name = ?,
             terms_photo_url = ?, status = 'PENDING', rejection_reason = NULL,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          full_name,
          ktp_name,
          ktp_number,
          ktp_photo_url,
          bank_account_photo_url,
          account_number,
          bank_name,
          terms_photo_url,
          verificationId,
        ]
      );
      return verificationId;
    }

    // Create new verification request
    const verificationId = uuidv4();
    await databaseService.execute(
      `INSERT INTO creator_verifications 
       (id, user_id, full_name, ktp_name, ktp_number, ktp_photo_url,
        bank_account_photo_url, account_number, bank_name, terms_photo_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
      [
        verificationId,
        userId,
        full_name,
        ktp_name,
        ktp_number,
        ktp_photo_url,
        bank_account_photo_url,
        account_number,
        bank_name,
        terms_photo_url,
      ]
    );

    return verificationId;
  }

  /**
   * Get verification status for a user
   */
  async getVerificationStatus(userId: string): Promise<CreatorVerification | null> {
    const verifications = await databaseService.query<CreatorVerification>(
      'SELECT * FROM creator_verifications WHERE user_id = ?',
      [userId]
    );

    return verifications.length > 0 ? verifications[0] : null;
  }

  /**
   * Get all pending verifications (admin)
   */
  async getAllVerifications(status?: string): Promise<CreatorVerification[]> {
    let query = `
      SELECT cv.*, u.email, u.full_name as user_full_name
      FROM creator_verifications cv
      JOIN users u ON cv.user_id = u.id
    `;
    const params: any[] = [];

    if (status) {
      query += ' WHERE cv.status = ?';
      params.push(status);
    }

    query += ' ORDER BY cv.created_at DESC';

    return await databaseService.query<CreatorVerification>(query, params);
  }

  /**
   * Get verification by ID (admin)
   */
  async getVerificationById(verificationId: string): Promise<CreatorVerification | null> {
    const verifications = await databaseService.query<CreatorVerification>(
      `SELECT cv.*, u.email, u.full_name as user_full_name
       FROM creator_verifications cv
       JOIN users u ON cv.user_id = u.id
       WHERE cv.id = ?`,
      [verificationId]
    );

    return verifications.length > 0 ? verifications[0] : null;
  }

  /**
   * Approve or reject verification (admin)
   */
  async reviewVerification(data: ApproveRejectData): Promise<void> {
    const { verificationId, status, rejection_reason } = data;

    // Get verification
    const verification = await this.getVerificationById(verificationId);
    if (!verification) {
      throw new Error('Verification not found');
    }

    if (verification.status !== 'PENDING') {
      throw new Error('Verification already reviewed');
    }

    // Use transaction to update verification and user role
    await databaseService.transaction(async (connection) => {
      // Update verification status
      if (status === 'APPROVED') {
        await connection.execute(
          `UPDATE creator_verifications 
           SET status = 'APPROVED', rejection_reason = NULL, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [verificationId]
        );

        // Update user role to CREATOR
        await connection.execute(
          `UPDATE users SET role = 'CREATOR' WHERE id = ?`,
          [verification.user_id]
        );
      } else {
        // REJECTED
        await connection.execute(
          `UPDATE creator_verifications 
           SET status = 'REJECTED', rejection_reason = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [rejection_reason || 'Verification rejected', verificationId]
        );
      }
    });
  }

  /**
   * Increment warning count for a creator
   */
  async incrementWarningCount(userId: string): Promise<void> {
    await databaseService.execute(
      `UPDATE creator_verifications 
       SET warning_count = warning_count + 1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [userId]
    );
  }

  /**
   * Get warning count for a creator
   */
  async getWarningCount(userId: string): Promise<number> {
    const verifications = await databaseService.query<CreatorVerification>(
      'SELECT warning_count FROM creator_verifications WHERE user_id = ?',
      [userId]
    );

    return verifications.length > 0 ? verifications[0].warning_count : 0;
  }
}

export default new VerificationService();
