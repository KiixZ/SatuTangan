import { Request, Response } from "express";
import donationService from "../services/donationService";

/**
 * Create a new donation
 */
export const createDonation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      campaignId,
      donorName,
      donorEmail,
      donorPhone,
      amount,
      prayer,
      isAnonymous,
    } = req.body;

    // Validation
    if (!campaignId || !donorName || !donorEmail || !donorPhone || !amount) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_001",
          message: "Missing required fields",
        },
      });
      return;
    }

    if (amount < 1000) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_002",
          message: "Minimum donation amount is Rp 1,000",
        },
      });
      return;
    }

    const userId = req.user?.id;

    const donation = await donationService.createDonation({
      campaignId,
      userId,
      donorName,
      donorEmail,
      donorPhone,
      amount,
      prayer,
      isAnonymous: isAnonymous || false,
    });

    res.status(201).json({
      success: true,
      data: donation,
    });
  } catch (error: any) {
    console.error("Create donation error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: error.message || "Failed to create donation",
      },
    });
  }
};

/**
 * Get donation by ID
 */
export const getDonationById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const donation = await donationService.getDonationById(id);

    if (!donation) {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND_001",
          message: "Donation not found",
        },
      });
      return;
    }

    res.json({
      success: true,
      data: donation,
    });
  } catch (error: any) {
    console.error("Get donation error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Failed to get donation",
      },
    });
  }
};

/**
 * Get donation by order ID
 */
export const getDonationByOrderId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { orderId } = req.params;

    const donation = await donationService.getDonationByOrderId(orderId);

    if (!donation) {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND_001",
          message: "Donation not found",
        },
      });
      return;
    }

    res.json({
      success: true,
      data: donation,
    });
  } catch (error: any) {
    console.error("Get donation by order ID error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Failed to get donation",
      },
    });
  }
};

/**
 * Get user donation history
 */
export const getUserDonationHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const email = req.user!.email;

    const donations = await donationService.getUserDonationHistory(
      userId,
      email,
    );

    res.json({
      success: true,
      data: donations,
    });
  } catch (error: any) {
    console.error("Get user donation history error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Failed to get donation history",
      },
    });
  }
};

/**
 * Get campaign donations (public)
 */
export const getCampaignDonations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const donations = await donationService.getCampaignDonations(id, limit);

    res.json({
      success: true,
      data: donations,
    });
  } catch (error: any) {
    console.error("Get campaign donations error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Failed to get campaign donations",
      },
    });
  }
};

/**
 * Get campaign prayers (public)
 */
export const getCampaignPrayers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    const prayers = await donationService.getCampaignPrayers(id, limit);

    res.json({
      success: true,
      data: prayers,
    });
  } catch (error: any) {
    console.error("Get campaign prayers error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Failed to get campaign prayers",
      },
    });
  }
};

/**
 * Recalculate all campaigns collected amounts (Admin only)
 */
export const recalculateCollectedAmounts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log("=== ADMIN RECALCULATE REQUEST ===");
    console.log("User:", req.user);

    const result = await donationService.recalculateCollectedAmounts();

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Recalculate collected amounts error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Failed to recalculate collected amounts",
      },
    });
  }
};

/**
 * Recalculate single campaign collected amount (Admin only)
 */
export const recalculateSingleCampaign = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { campaignId } = req.params;

    console.log(`=== ADMIN RECALCULATE REQUEST FOR CAMPAIGN ${campaignId} ===`);
    console.log("User:", req.user);

    const result = await donationService.recalculateSingleCampaign(campaignId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Recalculate single campaign error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: error.message || "Failed to recalculate campaign",
      },
    });
  }
};
