import { Request, Response } from "express";
import { validationResult } from "express-validator";
import withdrawalService from "../services/withdrawalService";
import campaignService from "../services/campaignService";

export class WithdrawalController {
  /**
   * Get withdrawals with pagination and filters (admin only)
   */
  async getWithdrawals(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_001",
            message: "Invalid input data",
            details: errors.array(),
          },
        });
      }

      const { page, limit, campaign_id, status } = req.query;

      const result = await withdrawalService.getWithdrawals({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        campaign_id: campaign_id as string,
        status: status as string,
      });

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Get withdrawals error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Get withdrawal by ID (admin only)
   */
  async getWithdrawalById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const withdrawal = await withdrawalService.getWithdrawalById(id);

      if (!withdrawal) {
        return res.status(404).json({
          success: false,
          error: {
            code: "WITHDRAWAL_001",
            message: "Withdrawal not found",
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: withdrawal,
      });
    } catch (error) {
      console.error("Get withdrawal by ID error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Create withdrawal (admin only)
   */
  async createWithdrawal(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_001",
            message: "Invalid input data",
            details: errors.array(),
          },
        });
      }

      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: "AUTH_003",
            message: "Unauthorized access",
          },
        });
      }

      const { campaign_id, amount, note } = req.body;

      // Check if campaign exists
      const campaign = await campaignService.getCampaignById(campaign_id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      // Validate withdrawal amount
      if (amount > campaign.collected_amount) {
        return res.status(400).json({
          success: false,
          error: {
            code: "WITHDRAWAL_002",
            message: "Withdrawal amount exceeds collected amount",
          },
        });
      }

      // Get total already withdrawn
      const totalWithdrawn =
        await withdrawalService.getTotalWithdrawnAmount(campaign_id);
      const availableAmount = campaign.collected_amount - totalWithdrawn;

      if (amount > availableAmount) {
        return res.status(400).json({
          success: false,
          error: {
            code: "WITHDRAWAL_002",
            message: `Withdrawal amount exceeds available amount. Available: Rp ${availableAmount.toLocaleString("id-ID")}`,
          },
        });
      }

      // Create withdrawal
      const withdrawalId = await withdrawalService.createWithdrawal({
        campaign_id,
        amount: parseFloat(amount),
        note,
        processed_by: userId,
      });

      const withdrawal =
        await withdrawalService.getWithdrawalById(withdrawalId);

      return res.status(201).json({
        success: true,
        message: "Withdrawal created successfully",
        data: withdrawal,
      });
    } catch (error) {
      console.error("Create withdrawal error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Update withdrawal status (admin only)
   */
  async updateWithdrawalStatus(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_001",
            message: "Invalid input data",
            details: errors.array(),
          },
        });
      }

      const { id } = req.params;
      const { status } = req.body;

      // Check if withdrawal exists
      const withdrawal = await withdrawalService.getWithdrawalById(id);
      if (!withdrawal) {
        return res.status(404).json({
          success: false,
          error: {
            code: "WITHDRAWAL_001",
            message: "Withdrawal not found",
          },
        });
      }

      // Update status
      const updated = await withdrawalService.updateWithdrawalStatus(
        id,
        status,
      );

      if (!updated) {
        return res.status(400).json({
          success: false,
          error: {
            code: "WITHDRAWAL_003",
            message: "Failed to update withdrawal status",
          },
        });
      }

      const updatedWithdrawal = await withdrawalService.getWithdrawalById(id);

      return res.status(200).json({
        success: true,
        message: "Withdrawal status updated successfully",
        data: updatedWithdrawal,
      });
    } catch (error) {
      console.error("Update withdrawal status error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Creator requests withdrawal
   */
  async requestWithdrawal(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_001",
            message: "Invalid input data",
            details: errors.array(),
          },
        });
      }

      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: "AUTH_003",
            message: "Unauthorized access",
          },
        });
      }

      const { campaign_id, amount, note } = req.body;

      // Check if campaign exists and belongs to the creator
      const campaign = await campaignService.getCampaignById(campaign_id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      // Verify campaign ownership
      if (campaign.creator_id !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: "AUTH_004",
            message:
              "You are not authorized to request withdrawal for this campaign",
          },
        });
      }

      // Validate withdrawal amount
      if (amount > campaign.collected_amount) {
        return res.status(400).json({
          success: false,
          error: {
            code: "WITHDRAWAL_002",
            message: "Withdrawal amount exceeds collected amount",
          },
        });
      }

      // Get total already withdrawn
      const totalWithdrawn =
        await withdrawalService.getTotalWithdrawnAmount(campaign_id);
      const availableAmount = campaign.collected_amount - totalWithdrawn;

      if (amount > availableAmount) {
        return res.status(400).json({
          success: false,
          error: {
            code: "WITHDRAWAL_002",
            message: `Withdrawal amount exceeds available amount. Available: Rp ${availableAmount.toLocaleString("id-ID")}`,
          },
        });
      }

      // Create withdrawal request (status will be PROCESSING, waiting for admin approval)
      const withdrawalId = await withdrawalService.createWithdrawal({
        campaign_id,
        amount: parseFloat(amount),
        note,
        processed_by: userId,
      });

      const withdrawal =
        await withdrawalService.getWithdrawalById(withdrawalId);

      return res.status(201).json({
        success: true,
        message:
          "Withdrawal request submitted successfully. Waiting for admin approval.",
        data: withdrawal,
      });
    } catch (error) {
      console.error("Request withdrawal error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Get creator's withdrawals
   */
  async getMyWithdrawals(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: "AUTH_003",
            message: "Unauthorized access",
          },
        });
      }

      // Get all campaigns by this creator
      const campaigns = await campaignService.getCampaignsByCreatorId(userId);
      const campaignIds = campaigns.map((c: any) => c.id);

      // Get withdrawals for these campaigns
      const withdrawals =
        await withdrawalService.getWithdrawalsByCampaignIds(campaignIds);

      return res.status(200).json({
        success: true,
        data: withdrawals,
      });
    } catch (error) {
      console.error("Get my withdrawals error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Get recent withdrawals (public)
   */
  async getRecentWithdrawals(req: Request, res: Response) {
    try {
      const { limit } = req.query;
      const withdrawalLimit = limit ? parseInt(limit as string) : 10;

      const withdrawals =
        await withdrawalService.getRecentWithdrawals(withdrawalLimit);

      return res.status(200).json({
        success: true,
        data: withdrawals,
      });
    } catch (error) {
      console.error("Get recent withdrawals error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Get campaign withdrawals (admin only)
   */
  async getCampaignWithdrawals(req: Request, res: Response) {
    try {
      const { campaignId } = req.params;

      // Check if campaign exists
      const campaign = await campaignService.getCampaignById(campaignId);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      const withdrawals =
        await withdrawalService.getCampaignWithdrawals(campaignId);
      const totalWithdrawn =
        await withdrawalService.getTotalWithdrawnAmount(campaignId);

      return res.status(200).json({
        success: true,
        data: {
          withdrawals,
          total_withdrawn: totalWithdrawn,
          available_amount: campaign.collected_amount - totalWithdrawn,
        },
      });
    } catch (error) {
      console.error("Get campaign withdrawals error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }
}

export default new WithdrawalController();
