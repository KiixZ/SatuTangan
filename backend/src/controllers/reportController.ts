import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import reportService from '../services/reportService';
import campaignService from '../services/campaignService';

export class ReportController {
  /**
   * Submit a report (public)
   */
  async submitReport(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_001',
            message: 'Invalid input data',
            details: errors.array(),
          },
        });
      }

      const { campaign_id, reason, description, reporter_email } = req.body;
      const userId = req.user?.userId; // Optional - may be null for non-logged in users

      // Check if campaign exists
      const campaign = await campaignService.getCampaignById(campaign_id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'CAMPAIGN_001',
            message: 'Campaign not found',
          },
        });
      }

      // Check if user has already reported this campaign
      const hasReported = await reportService.hasUserReportedCampaign(
        campaign_id,
        reporter_email
      );

      if (hasReported) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'REPORT_001',
            message: 'You have already reported this campaign',
          },
        });
      }

      // Submit report
      const reportId = await reportService.submitReport({
        campaign_id,
        reporter_id: userId,
        reporter_email,
        reason,
        description,
      });

      return res.status(201).json({
        success: true,
        message: 'Report submitted successfully. We will review it shortly.',
        data: { id: reportId },
      });
    } catch (error) {
      console.error('Submit report error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_001',
          message: 'Internal server error',
        },
      });
    }
  }

  /**
   * Get all reports (admin only)
   */
  async getReports(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_001',
            message: 'Invalid input data',
            details: errors.array(),
          },
        });
      }

      const { page, limit, status, campaign_id } = req.query;

      const result = await reportService.getReports({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as string,
        campaign_id: campaign_id as string,
      });

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('Get reports error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_001',
          message: 'Internal server error',
        },
      });
    }
  }

  /**
   * Get report by ID (admin only)
   */
  async getReportById(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_001',
            message: 'Invalid input data',
            details: errors.array(),
          },
        });
      }

      const { id } = req.params;
      const report = await reportService.getReportById(id);

      if (!report) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'REPORT_002',
            message: 'Report not found',
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      console.error('Get report by ID error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_001',
          message: 'Internal server error',
        },
      });
    }
  }

  /**
   * Review report (admin only)
   */
  async reviewReport(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_001',
            message: 'Invalid input data',
            details: errors.array(),
          },
        });
      }

      const { id } = req.params;
      const { status, admin_note, action } = req.body;
      const adminId = req.user?.userId;

      if (!adminId) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_003',
            message: 'Unauthorized access',
          },
        });
      }

      // Check if report exists
      const report = await reportService.getReportById(id);
      if (!report) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'REPORT_002',
            message: 'Report not found',
          },
        });
      }

      // Check if report is already reviewed
      if (report.status !== 'PENDING') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'REPORT_003',
            message: 'Report has already been reviewed',
          },
        });
      }

      // Review report
      const reviewed = await reportService.reviewReport(
        id,
        { status, admin_note, action },
        adminId
      );

      if (!reviewed) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'REPORT_004',
            message: 'Failed to review report',
          },
        });
      }

      const updatedReport = await reportService.getReportById(id);

      return res.status(200).json({
        success: true,
        message: 'Report reviewed successfully',
        data: updatedReport,
      });
    } catch (error) {
      console.error('Review report error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_001',
          message: 'Internal server error',
        },
      });
    }
  }
}

export default new ReportController();
