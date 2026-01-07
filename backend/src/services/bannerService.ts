import databaseService from './databaseService';
import { fileService } from './fileService';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBannerData {
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  is_active?: boolean;
}

export interface UpdateBannerData {
  title?: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  is_active?: boolean;
}

class BannerService {
  /**
   * Get all active banners (public)
   */
  async getActiveBanners(): Promise<Banner[]> {
    const sql = `
      SELECT * FROM banners 
      WHERE is_active = true 
      ORDER BY created_at DESC
    `;

    const banners = await databaseService.query<Banner & RowDataPacket>(sql);
    return banners;
  }

  /**
   * Get all banners (admin)
   */
  async getAllBanners(): Promise<Banner[]> {
    const sql = `
      SELECT * FROM banners 
      ORDER BY created_at DESC
    `;

    const banners = await databaseService.query<Banner & RowDataPacket>(sql);
    return banners;
  }

  /**
   * Get banner by ID
   */
  async getBannerById(id: string): Promise<Banner | null> {
    const sql = 'SELECT * FROM banners WHERE id = ?';
    const banners = await databaseService.query<Banner & RowDataPacket>(sql, [id]);

    return banners.length > 0 ? banners[0] : null;
  }

  /**
   * Create new banner
   */
  async createBanner(data: CreateBannerData): Promise<string> {
    const sql = `
      INSERT INTO banners (title, description, image_url, link_url, is_active)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await databaseService.execute(sql, [
      data.title,
      data.description || null,
      data.image_url,
      data.link_url || null,
      data.is_active !== undefined ? data.is_active : true,
    ]);

    // Get the inserted banner ID
    const selectSql = 'SELECT id FROM banners WHERE id = LAST_INSERT_ID()';
    const banners = await databaseService.query<{ id: string } & RowDataPacket>(selectSql);

    return banners[0].id;
  }

  /**
   * Update banner
   */
  async updateBanner(id: string, data: UpdateBannerData): Promise<boolean> {
    const banner = await this.getBannerById(id);
    if (!banner) {
      return false;
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }

    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description || null);
    }

    if (data.image_url !== undefined) {
      updates.push('image_url = ?');
      values.push(data.image_url);

      // Delete old image if new one is provided
      if (banner.image_url !== data.image_url) {
        await fileService.deleteFile(banner.image_url);
      }
    }

    if (data.link_url !== undefined) {
      updates.push('link_url = ?');
      values.push(data.link_url || null);
    }

    if (data.is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(data.is_active);
    }

    if (updates.length === 0) {
      return true; // Nothing to update
    }

    values.push(id);
    const sql = `UPDATE banners SET ${updates.join(', ')} WHERE id = ?`;

    await databaseService.execute(sql, values);
    return true;
  }

  /**
   * Delete banner
   */
  async deleteBanner(id: string): Promise<boolean> {
    const banner = await this.getBannerById(id);
    if (!banner) {
      return false;
    }

    // Delete image file
    await fileService.deleteFile(banner.image_url);

    // Delete from database
    const sql = 'DELETE FROM banners WHERE id = ?';
    await databaseService.execute(sql, [id]);

    return true;
  }

  /**
   * Toggle banner active status
   */
  async toggleBannerStatus(id: string): Promise<boolean> {
    const banner = await this.getBannerById(id);
    if (!banner) {
      return false;
    }

    const sql = 'UPDATE banners SET is_active = ? WHERE id = ?';
    await databaseService.execute(sql, [!banner.is_active, id]);

    return true;
  }
}

export default new BannerService();
