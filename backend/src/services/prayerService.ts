import { RowDataPacket } from "mysql2";
import db from "./databaseService";

interface Prayer extends RowDataPacket {
  id: string;
  campaign_id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  prayer: string;
  is_anonymous: boolean;
  created_at: Date;
}

interface PrayerWithUser extends Prayer {
  user_photo?: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  campaign_id?: string;
}

export class PrayerService {
  /**
   * Get prayers from donations with pagination
   * Only show donations with prayer message and SUCCESS status
   */
  async getPrayers(params: PaginationParams = {}) {
    const { page = 1, limit = 10, campaign_id } = params;
    const offset = (page - 1) * limit;

    const conditions: string[] = [
      "d.prayer IS NOT NULL",
      "d.prayer != ''",
      "d.status = 'SUCCESS'",
    ];
    const queryParams: any[] = [];

    if (campaign_id) {
      conditions.push("d.campaign_id = ?");
      queryParams.push(campaign_id);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    // Get total count
    const countSql = `
      SELECT COUNT(*) as total
      FROM donations d
      ${whereClause}
    `;
    const countResult = await db.query<RowDataPacket>(countSql, queryParams);
    const total = (countResult[0] as any).total;

    // Get prayers with user details and campaign info
    const sql = `
      SELECT
        d.id,
        d.campaign_id,
        d.donor_name,
        d.donor_email,
        d.amount,
        d.prayer,
        d.is_anonymous,
        d.created_at,
        c.title as campaign_title,
        u.profile_photo_url as user_photo
      FROM donations d
      LEFT JOIN campaigns c ON d.campaign_id = c.id
      LEFT JOIN users u ON d.user_id = u.id
      ${whereClause}
      ORDER BY d.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const prayerQueryParams = [...queryParams, limit, offset];
    const prayers = await db.query<PrayerWithUser>(sql, prayerQueryParams);

    // Hide user details for anonymous prayers
    const processedPrayers = prayers.map((prayer: any) => ({
      id: prayer.id,
      campaign_id: prayer.campaign_id,
      campaign_title: prayer.campaign_title,
      user_name: prayer.is_anonymous ? "Hamba Allah" : prayer.donor_name,
      user_photo: prayer.is_anonymous ? null : prayer.user_photo,
      message: prayer.prayer,
      amount: prayer.amount,
      is_anonymous: prayer.is_anonymous,
      created_at: prayer.created_at,
    }));

    return {
      data: processedPrayers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get prayer count for a campaign
   */
  async getPrayerCount(campaignId: string): Promise<number> {
    const sql = `
      SELECT COUNT(*) as total
      FROM donations
      WHERE campaign_id = ?
        AND prayer IS NOT NULL
        AND prayer != ''
        AND status = 'SUCCESS'
    `;

    const result = await db.query<RowDataPacket>(sql, [campaignId]);
    return (result[0] as any).total || 0;
  }

  /**
   * Get recent prayers for homepage (public display)
   */
  async getRecentPrayers(limit: number = 10) {
    const sql = `
      SELECT
        d.id,
        d.campaign_id,
        d.donor_name,
        d.amount,
        d.prayer,
        d.is_anonymous,
        d.created_at,
        c.title as campaign_title,
        u.profile_photo_url as user_photo
      FROM donations d
      LEFT JOIN campaigns c ON d.campaign_id = c.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.prayer IS NOT NULL
        AND d.prayer != ''
        AND d.status = 'SUCCESS'
      ORDER BY d.created_at DESC
      LIMIT ?
    `;

    const prayers = await db.query<RowDataPacket>(sql, [limit]);

    // Process for display
    return prayers.map((prayer: any) => ({
      id: prayer.id,
      campaign_id: prayer.campaign_id,
      campaign_title: prayer.campaign_title,
      user_name: prayer.is_anonymous ? "Hamba Allah" : prayer.donor_name,
      user_photo: prayer.is_anonymous ? null : prayer.user_photo,
      message: prayer.prayer,
      amount: prayer.amount,
      is_anonymous: prayer.is_anonymous,
      created_at: prayer.created_at,
    }));
  }
}

export default new PrayerService();
