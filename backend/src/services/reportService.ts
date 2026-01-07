import { RowDataPacket } from 'mysql2';
import db from './databaseService';
import verificationService from './verificationService';
import campaignService from './campaignService';
import emailService from './emailService';

interface Report extends RowDataPacket {
  id: string;
  campaign_id: string;
  reporter_id: string | null;
  reporter_email: string;
  reason: string;
  description: string;
  status: 'PENDING' | 'REVIEWED' | 'REJECTED';
  admin_note: string | null;
  created_at: Date;
  updated_at: Date;
}

interface ReportWithDetails extends Report {
  campaign_title?: string;
  campaign_creator_id?: string;
  reporter_name?: string;
}

interface CreateReportData {
  campaign_id: string;
  reporter_id?: string;
  reporter_email: string;
  reason: string;
  description: string;
}

interface ReviewReportData {
  status: 'REVIEWED' | 'REJECTED';
  admin_note?: string;
  action: 'WARNING' | 'SUSPEND' | 'REJECT';
}

interface PaginationParams {
  page?: number;
  limit?: number;
  status?: string;
  campaign_id?: string;
}

export class ReportService {
  /**
   * Submit a new report
   */
  async submitReport(data: CreateReportData): Promise<string> {
    const sql = `
      INSERT INTO reports (
        campaign_id, reporter_id, reporter_email, reason, description, status
      ) VALUES (?, ?, ?, ?, ?, 'PENDING')
    `;

    const result = await db.execute(sql, [
      data.campaign_id,
      data.reporter_id || null,
      data.reporter_email,
      data.reason,
      data.description,
    ]);

    return result.insertId.toString();
  }

  /**
   * Get reports with pagination and filters
   */
  async getReports(params: PaginationParams = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      campaign_id,
    } = params;

    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const queryParams: any[] = [];

    if (status) {
      conditions.push('r.status = ?');
      queryParams.push(status);
    }

    if (campaign_id) {
      conditions.push('r.campaign_id = ?');
      queryParams.push(campaign_id);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countSql = `
      SELECT COUNT(*) as total
      FROM reports r
      ${whereClause}
    `;
    const countResult = await db.query<RowDataPacket>(countSql, queryParams);
    const total = (countResult[0] as any).total;

    // Get reports with details
    const sql = `
      SELECT 
        r.*,
        c.title as campaign_title,
        c.creator_id as campaign_creator_id,
        u.full_name as reporter_name
      FROM reports r
      LEFT JOIN campaigns c ON r.campaign_id = c.id
      LEFT JOIN users u ON r.reporter_id = u.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const reportQueryParams = [...queryParams, limit, offset];
    const reports = await db.query<ReportWithDetails>(sql, reportQueryParams);

    return {
      data: reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get report by ID with details
   */
  async getReportById(id: string): Promise<ReportWithDetails | null> {
    const sql = `
      SELECT 
        r.*,
        c.title as campaign_title,
        c.creator_id as campaign_creator_id,
        c.status as campaign_status,
        u.full_name as reporter_name,
        creator.full_name as creator_name,
        creator.email as creator_email
      FROM reports r
      LEFT JOIN campaigns c ON r.campaign_id = c.id
      LEFT JOIN users u ON r.reporter_id = u.id
      LEFT JOIN users creator ON c.creator_id = creator.id
      WHERE r.id = ?
    `;

    const reports = await db.query<ReportWithDetails>(sql, [id]);
    return reports.length > 0 ? reports[0] : null;
  }

  /**
   * Review report and take action
   */
  async reviewReport(reportId: string, data: ReviewReportData, adminId: string): Promise<boolean> {
    const report = await this.getReportById(reportId);
    if (!report) {
      return false;
    }

    // Start transaction
    return await db.transaction(async (connection) => {
      // Update report status
      const updateReportSql = `
        UPDATE reports 
        SET status = ?, admin_note = ?
        WHERE id = ?
      `;
      await connection.execute(updateReportSql, [
        data.status,
        data.admin_note || null,
        reportId,
      ]);

      // Take action based on review decision
      if (data.status === 'REVIEWED') {
        const campaignCreatorId = (report as any).campaign_creator_id;

        if (data.action === 'WARNING') {
          // Increment warning count for creator
          await verificationService.incrementWarningCount(campaignCreatorId);

          // Send warning email to creator
          const creatorEmail = (report as any).creator_email;
          const creatorName = (report as any).creator_name;
          const campaignTitle = report.campaign_title;

          if (creatorEmail) {
            await emailService.sendWarningEmail(
              creatorEmail,
              creatorName,
              campaignTitle || 'Your campaign',
              data.admin_note || 'Your campaign has been reported and reviewed.'
            );
          }
        } else if (data.action === 'SUSPEND') {
          // Suspend the campaign
          await campaignService.updateCampaignStatus(report.campaign_id, 'SUSPENDED');

          // Increment warning count
          await verificationService.incrementWarningCount(campaignCreatorId);

          // Send suspension email to creator
          const creatorEmail = (report as any).creator_email;
          const creatorName = (report as any).creator_name;
          const campaignTitle = report.campaign_title;

          if (creatorEmail) {
            await emailService.sendSuspensionEmail(
              creatorEmail,
              creatorName,
              campaignTitle || 'Your campaign',
              data.admin_note || 'Your campaign has been suspended due to violations.'
            );
          }
        }
        // If action is 'REJECT', no action needed on campaign or creator
      }

      return true;
    });
  }

  /**
   * Get report count by campaign
   */
  async getReportCountByCampaign(campaignId: string): Promise<number> {
    const sql = `
      SELECT COUNT(*) as count
      FROM reports
      WHERE campaign_id = ?
    `;
    const result = await db.query<RowDataPacket>(sql, [campaignId]);
    return (result[0] as any).count || 0;
  }

  /**
   * Check if user has already reported a campaign
   */
  async hasUserReportedCampaign(campaignId: string, reporterEmail: string): Promise<boolean> {
    const sql = `
      SELECT id FROM reports
      WHERE campaign_id = ? AND reporter_email = ?
    `;
    const reports = await db.query<Report>(sql, [campaignId, reporterEmail]);
    return reports.length > 0;
  }
}

export default new ReportService();
