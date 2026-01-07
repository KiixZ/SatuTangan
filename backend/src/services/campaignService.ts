import { RowDataPacket } from "mysql2";
import db from "./databaseService";

interface Campaign extends RowDataPacket {
  id: string;
  title: string;
  description: string;
  category_id: string;
  creator_id: string;
  target_amount: number;
  collected_amount: number;
  thumbnail_url: string;
  start_date: Date;
  end_date: Date;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "SUSPENDED";
  is_emergency: boolean;
  created_at: Date;
  updated_at: Date;
}

interface CampaignWithDetails extends Campaign {
  category_name?: string;
  creator_name?: string;
  creator_email?: string;
}

interface CreateCampaignData {
  title: string;
  description: string;
  category_id: string;
  creator_id: string;
  target_amount: number;
  thumbnail_url: string;
  start_date: string;
  end_date: string;
  status?: "DRAFT" | "ACTIVE";
}

interface UpdateCampaignData {
  title?: string;
  description?: string;
  category_id?: string;
  target_amount?: number;
  thumbnail_url?: string;
  start_date?: string;
  end_date?: string;
  status?: "DRAFT" | "ACTIVE" | "COMPLETED" | "SUSPENDED";
}

interface PaginationParams {
  page?: number;
  limit?: number;
  category_id?: string;
  status?: string;
  is_emergency?: boolean;
  creator_id?: string;
  search?: string;
}

export class CampaignService {
  /**
   * Get campaigns with pagination and filters
   */
  async getCampaigns(params: PaginationParams = {}) {
    const {
      page = 1,
      limit = 10,
      category_id,
      status,
      is_emergency,
      creator_id,
      search,
    } = params;

    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const queryParams: any[] = [];

    if (category_id) {
      conditions.push("c.category_id = ?");
      queryParams.push(category_id);
    }

    if (status) {
      conditions.push("c.status = ?");
      queryParams.push(status);
    }

    if (is_emergency !== undefined) {
      conditions.push("c.is_emergency = ?");
      queryParams.push(is_emergency);
    }

    if (creator_id) {
      conditions.push("c.creator_id = ?");
      queryParams.push(creator_id);
    }

    if (search) {
      conditions.push("(c.title LIKE ? OR c.description LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countSql = `
      SELECT COUNT(*) as total
      FROM campaigns c
      ${whereClause}
    `;
    const countResult = await db.query<RowDataPacket>(countSql, queryParams);
    const total = (countResult[0] as any).total;

    // Get campaigns with details
    const sql = `
      SELECT
        c.*,
        cat.name as category_name,
        u.full_name as creator_name,
        u.email as creator_email
      FROM campaigns c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.creator_id = u.id
      ${whereClause}
      ORDER BY c.is_emergency DESC, c.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const campaignQueryParams = [...queryParams, limit, offset];
    const campaigns = await db.query<CampaignWithDetails>(
      sql,
      campaignQueryParams,
    );

    return {
      data: campaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get campaign by ID with details
   */
  async getCampaignById(id: string): Promise<CampaignWithDetails | null> {
    const sql = `
      SELECT
        c.*,
        cat.name as category_name,
        cat.description as category_description,
        u.full_name as creator_name,
        u.email as creator_email
      FROM campaigns c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.creator_id = u.id
      WHERE c.id = ?
    `;

    const campaigns = await db.query<CampaignWithDetails>(sql, [id]);
    return campaigns.length > 0 ? campaigns[0] : null;
  }

  /**
   * Get campaigns by creator ID
   */
  async getCampaignsByCreatorId(creatorId: string): Promise<Campaign[]> {
    const sql = `
      SELECT
        c.*,
        cat.name as category_name
      FROM campaigns c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.creator_id = ?
      ORDER BY c.created_at DESC
    `;

    return await db.query<Campaign>(sql, [creatorId]);
  }

  /**
   * Create a new campaign
   */
  async createCampaign(data: CreateCampaignData): Promise<string> {
    // Helper function to convert ISO datetime to MySQL format
    const formatDateTimeForMySQL = (dateString: string): string => {
      if (!dateString) return "";
      // Handle both ISO format and MySQL format
      if (dateString.includes("T") && dateString.includes("Z")) {
        // ISO format: 2025-11-10T00:00:00Z
        return dateString.replace("T", " ").replace("Z", "");
      } else if (dateString.includes("T")) {
        // ISO format without Z: 2025-11-10T00:00:00
        return dateString.replace("T", " ");
      }
      // Already in correct format or other format, return as-is
      return dateString;
    };

    const sql = `
      INSERT INTO campaigns (
        title, description, category_id, creator_id,
        target_amount, thumbnail_url, start_date, end_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.execute(sql, [
      data.title,
      data.description,
      data.category_id,
      data.creator_id,
      data.target_amount,
      data.thumbnail_url,
      formatDateTimeForMySQL(data.start_date),
      formatDateTimeForMySQL(data.end_date),
      data.status || "DRAFT",
    ]);

    return result.insertId.toString();
  }

  /**
   * Update campaign
   */
  async updateCampaign(id: string, data: UpdateCampaignData): Promise<boolean> {
    // Helper function to convert ISO datetime to MySQL format
    const formatDateTimeForMySQL = (dateString: string): string => {
      if (!dateString) return "";
      // Handle both ISO format and MySQL format
      if (dateString.includes("T") && dateString.includes("Z")) {
        // ISO format: 2025-11-10T00:00:00Z
        return dateString.replace("T", " ").replace("Z", "");
      } else if (dateString.includes("T")) {
        // ISO format without Z: 2025-11-10T00:00:00
        return dateString.replace("T", " ");
      }
      // Already in correct format or other format, return as-is
      return dateString;
    };

    const fields: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      fields.push("title = ?");
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push("description = ?");
      values.push(data.description);
    }
    if (data.category_id !== undefined) {
      fields.push("category_id = ?");
      values.push(data.category_id);
    }
    if (data.target_amount !== undefined) {
      fields.push("target_amount = ?");
      values.push(data.target_amount);
    }
    if (data.thumbnail_url !== undefined) {
      fields.push("thumbnail_url = ?");
      values.push(data.thumbnail_url);
    }
    if (data.start_date !== undefined) {
      fields.push("start_date = ?");
      values.push(formatDateTimeForMySQL(data.start_date));
    }
    if (data.end_date !== undefined) {
      fields.push("end_date = ?");
      values.push(formatDateTimeForMySQL(data.end_date));
    }
    if (data.status !== undefined) {
      fields.push("status = ?");
      values.push(data.status);
    }

    if (fields.length === 0) {
      return false;
    }

    values.push(id);

    const sql = `
      UPDATE campaigns
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    const result = await db.execute(sql, values);
    return result.affectedRows > 0;
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(id: string): Promise<boolean> {
    const sql = "DELETE FROM campaigns WHERE id = ?";
    const result = await db.execute(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Update campaign status
   */
  async updateCampaignStatus(
    id: string,
    status: "DRAFT" | "ACTIVE" | "COMPLETED" | "SUSPENDED",
  ): Promise<boolean> {
    const sql = "UPDATE campaigns SET status = ? WHERE id = ?";
    const result = await db.execute(sql, [status, id]);
    return result.affectedRows > 0;
  }

  /**
   * Toggle emergency status
   */
  async toggleEmergency(id: string, isEmergency: boolean): Promise<boolean> {
    const sql = "UPDATE campaigns SET is_emergency = ? WHERE id = ?";
    const result = await db.execute(sql, [isEmergency, id]);
    return result.affectedRows > 0;
  }

  /**
   * Check if user is campaign creator
   */
  async isCreator(campaignId: string, userId: string): Promise<boolean> {
    const sql = "SELECT id FROM campaigns WHERE id = ? AND creator_id = ?";
    const campaigns = await db.query<Campaign>(sql, [campaignId, userId]);
    return campaigns.length > 0;
  }

  /**
   * Update collected amount
   */
  async updateCollectedAmount(id: string, amount: number): Promise<boolean> {
    const sql =
      "UPDATE campaigns SET collected_amount = collected_amount + ? WHERE id = ?";
    const result = await db.execute(sql, [amount, id]);
    return result.affectedRows > 0;
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(campaignId: string) {
    const sql = `
      SELECT
        c.collected_amount,
        c.target_amount,
        COUNT(DISTINCT d.id) as total_donors,
        COUNT(DISTINCT d.id) FILTER (WHERE d.status = 'SUCCESS') as successful_donations
      FROM campaigns c
      LEFT JOIN donations d ON c.id = d.campaign_id
      WHERE c.id = ?
      GROUP BY c.id
    `;

    const stats = await db.query<RowDataPacket>(sql, [campaignId]);
    return stats.length > 0 ? stats[0] : null;
  }

  /**
   * Add campaign photo
   */
  async addCampaignPhoto(
    campaignId: string,
    photoUrl: string,
  ): Promise<string> {
    const sql =
      "INSERT INTO campaign_photos (campaign_id, photo_url) VALUES (?, ?)";
    const result = await db.execute(sql, [campaignId, photoUrl]);
    return result.insertId.toString();
  }

  /**
   * Get campaign photos
   */
  async getCampaignPhotos(campaignId: string) {
    const sql =
      "SELECT * FROM campaign_photos WHERE campaign_id = ? ORDER BY created_at DESC";
    return await db.query<RowDataPacket>(sql, [campaignId]);
  }

  /**
   * Delete campaign photo
   */
  async deleteCampaignPhoto(photoId: string): Promise<boolean> {
    const sql = "DELETE FROM campaign_photos WHERE id = ?";
    const result = await db.execute(sql, [photoId]);
    return result.affectedRows > 0;
  }

  /**
   * Get photo by ID
   */
  async getPhotoById(photoId: string) {
    const sql = "SELECT * FROM campaign_photos WHERE id = ?";
    const photos = await db.query<RowDataPacket>(sql, [photoId]);
    return photos.length > 0 ? photos[0] : null;
  }

  /**
   * Check if photo belongs to campaign
   */
  async isPhotoInCampaign(
    photoId: string,
    campaignId: string,
  ): Promise<boolean> {
    const sql =
      "SELECT id FROM campaign_photos WHERE id = ? AND campaign_id = ?";
    const photos = await db.query<RowDataPacket>(sql, [photoId, campaignId]);
    return photos.length > 0;
  }

  /**
   * Add campaign update
   */
  async addCampaignUpdate(
    campaignId: string,
    title: string,
    description: string,
    photoUrl?: string,
    isAutomatic: boolean = false,
  ): Promise<string> {
    const sql = `
      INSERT INTO campaign_updates (campaign_id, title, description, photo_url, is_automatic)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await db.execute(sql, [
      campaignId,
      title,
      description,
      photoUrl || null,
      isAutomatic,
    ]);
    return result.insertId.toString();
  }

  /**
   * Get campaign updates
   */
  async getCampaignUpdates(campaignId: string) {
    const sql = `
      SELECT * FROM campaign_updates
      WHERE campaign_id = ?
      ORDER BY created_at DESC
    `;
    return await db.query<RowDataPacket>(sql, [campaignId]);
  }

  /**
   * Get update by ID
   */
  async getUpdateById(updateId: string) {
    const sql = "SELECT * FROM campaign_updates WHERE id = ?";
    const updates = await db.query<RowDataPacket>(sql, [updateId]);
    return updates.length > 0 ? updates[0] : null;
  }

  /**
   * Delete campaign update
   */
  async deleteCampaignUpdate(updateId: string): Promise<boolean> {
    const sql = "DELETE FROM campaign_updates WHERE id = ?";
    const result = await db.execute(sql, [updateId]);
    return result.affectedRows > 0;
  }

  /**
   * Check and auto-complete expired campaigns
   */
  async checkAndCompleteExpiredCampaigns(): Promise<number> {
    const sql = `
      UPDATE campaigns 
      SET status = 'COMPLETED' 
      WHERE status = 'ACTIVE' 
      AND end_date < NOW()
    `;
    const result = await db.execute(sql);
    return result.affectedRows;
  }
}

export default new CampaignService();
