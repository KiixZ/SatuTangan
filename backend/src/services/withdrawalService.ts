import { RowDataPacket } from "mysql2";
import db from "./databaseService";
import campaignService from "./campaignService";

interface Withdrawal extends RowDataPacket {
  id: string;
  campaign_id: string;
  amount: number;
  note: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  processed_by: string;
  created_at: Date;
  updated_at: Date;
}

interface WithdrawalWithDetails extends Withdrawal {
  campaign_title?: string;
  campaign_creator_id?: string;
  creator_name?: string;
  creator_email?: string;
  bank_name?: string;
  account_number?: string;
  processed_by_name?: string;
}

interface CreateWithdrawalData {
  campaign_id: string;
  amount: number;
  note?: string;
  processed_by: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  campaign_id?: string;
  status?: string;
}

export class WithdrawalService {
  /**
   * Get withdrawals with pagination and filters
   */
  async getWithdrawals(params: PaginationParams = {}) {
    const { page = 1, limit = 10, campaign_id, status } = params;

    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const queryParams: any[] = [];

    if (campaign_id) {
      conditions.push("w.campaign_id = ?");
      queryParams.push(campaign_id);
    }

    if (status) {
      conditions.push("w.status = ?");
      queryParams.push(status);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countSql = `
      SELECT COUNT(*) as total
      FROM withdrawals w
      ${whereClause}
    `;
    const countResult = await db.query<RowDataPacket>(countSql, queryParams);
    const total = (countResult[0] as any).total;

    // Get withdrawals with details
    const sql = `
      SELECT
        w.*,
        c.title as campaign_title,
        c.creator_id as campaign_creator_id,
        u.full_name as creator_name,
        u.email as creator_email,
        cv.bank_name,
        cv.account_number,
        admin.full_name as processed_by_name
      FROM withdrawals w
      LEFT JOIN campaigns c ON w.campaign_id = c.id
      LEFT JOIN users u ON c.creator_id = u.id
      LEFT JOIN creator_verifications cv ON u.id = cv.user_id
      LEFT JOIN users admin ON w.processed_by = admin.id
      ${whereClause}
      ORDER BY w.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const withdrawalQueryParams = [...queryParams, limit, offset];
    const withdrawals = await db.query<WithdrawalWithDetails>(
      sql,
      withdrawalQueryParams,
    );

    return {
      data: withdrawals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get withdrawal by ID
   */
  async getWithdrawalById(id: string): Promise<WithdrawalWithDetails | null> {
    const sql = `
      SELECT
        w.*,
        c.title as campaign_title,
        c.creator_id as campaign_creator_id,
        u.full_name as creator_name,
        u.email as creator_email,
        cv.bank_name,
        cv.account_number,
        admin.full_name as processed_by_name
      FROM withdrawals w
      LEFT JOIN campaigns c ON w.campaign_id = c.id
      LEFT JOIN users u ON c.creator_id = u.id
      LEFT JOIN creator_verifications cv ON u.id = cv.user_id
      LEFT JOIN users admin ON w.processed_by = admin.id
      WHERE w.id = ?
    `;

    const withdrawals = await db.query<WithdrawalWithDetails>(sql, [id]);
    return withdrawals.length > 0 ? withdrawals[0] : null;
  }

  /**
   * Create a new withdrawal
   */
  async createWithdrawal(data: CreateWithdrawalData): Promise<string> {
    const sql = `
      INSERT INTO withdrawals (
        campaign_id, amount, note, processed_by, status
      ) VALUES (?, ?, ?, ?, 'PROCESSING')
    `;

    const result = await db.execute(sql, [
      data.campaign_id,
      data.amount,
      data.note || null,
      data.processed_by,
    ]);

    const withdrawalId = result.insertId.toString();

    // Auto-create campaign update for withdrawal
    const campaign = await campaignService.getCampaignById(data.campaign_id);
    if (campaign) {
      const updateTitle = "Pencairan Dana";
      const formattedAmount = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(data.amount);
      const updateDescription = `Dana sebesar ${formattedAmount} telah dicairkan untuk campaign ini. ${data.note ? data.note : ""}`;

      await campaignService.addCampaignUpdate(
        data.campaign_id,
        updateTitle,
        updateDescription,
        undefined,
        true, // is_automatic
      );
    }

    return withdrawalId;
  }

  /**
   * Update withdrawal status
   */
  async updateWithdrawalStatus(
    id: string,
    status: "PROCESSING" | "COMPLETED" | "FAILED",
  ): Promise<boolean> {
    const sql = "UPDATE withdrawals SET status = ? WHERE id = ?";
    const result = await db.execute(sql, [status, id]);
    return result.affectedRows > 0;
  }

  /**
   * Get recent withdrawals (for public display)
   */
  async getRecentWithdrawals(limit: number = 10) {
    const sql = `
      SELECT
        w.id,
        w.amount,
        w.note,
        w.created_at,
        w.campaign_id,
        c.title as campaign_title,
        c.description as campaign_description,
        c.creator_id,
        u.full_name as creator_name,
        u.profile_photo_url as creator_photo,
        cv.status as verification_status
      FROM withdrawals w
      LEFT JOIN campaigns c ON w.campaign_id = c.id
      LEFT JOIN users u ON c.creator_id = u.id
      LEFT JOIN creator_verifications cv ON u.id = cv.user_id
      WHERE w.status = 'COMPLETED'
      ORDER BY w.created_at DESC
      LIMIT ?
    `;

    return await db.query<RowDataPacket>(sql, [limit]);
  }

  /**
   * Get total withdrawals for a campaign
   */
  async getCampaignWithdrawals(campaignId: string) {
    const sql = `
      SELECT
        w.*,
        admin.full_name as processed_by_name
      FROM withdrawals w
      LEFT JOIN users admin ON w.processed_by = admin.id
      WHERE w.campaign_id = ?
      ORDER BY w.created_at DESC
    `;

    return await db.query<WithdrawalWithDetails>(sql, [campaignId]);
  }

  /**
   * Get total withdrawn amount for a campaign
   */
  async getTotalWithdrawnAmount(campaignId: string): Promise<number> {
    const sql = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM withdrawals
      WHERE campaign_id = ? AND status = 'COMPLETED'
    `;

    const result = await db.query<RowDataPacket>(sql, [campaignId]);
    return (result[0] as any).total || 0;
  }

  /**
   * Get withdrawals by multiple campaign IDs (for creator)
   */
  async getWithdrawalsByCampaignIds(campaignIds: string[]) {
    if (campaignIds.length === 0) {
      return [];
    }

    const placeholders = campaignIds.map(() => "?").join(",");
    const sql = `
      SELECT
        w.*,
        c.title as campaign_title,
        admin.full_name as processed_by_name
      FROM withdrawals w
      LEFT JOIN campaigns c ON w.campaign_id = c.id
      LEFT JOIN users admin ON w.processed_by = admin.id
      WHERE w.campaign_id IN (${placeholders})
      ORDER BY w.created_at DESC
    `;

    return await db.query<WithdrawalWithDetails>(sql, campaignIds);
  }
}

export default new WithdrawalService();
