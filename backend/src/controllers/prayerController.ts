import { Request, Response } from "express";
import prayerService from "../services/prayerService";

/**
 * Get all prayers with pagination
 */
export const getPrayers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { page, limit, campaign_id } = req.query;

    const result = await prayerService.getPrayers({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      campaign_id: campaign_id as string | undefined,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get prayers error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Internal server error",
      },
    });
  }
};

/**
 * Get prayer count for a campaign
 */
export const getPrayerCount = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { campaign_id } = req.params;

    const count = await prayerService.getPrayerCount(campaign_id);

    res.status(200).json({
      success: true,
      data: {
        count,
      },
    });
  } catch (error) {
    console.error("Get prayer count error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Internal server error",
      },
    });
  }
};

/**
 * Get recent prayers for homepage
 */
export const getRecentPrayers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { limit } = req.query;

    const prayers = await prayerService.getRecentPrayers(
      limit ? parseInt(limit as string) : 10,
    );

    res.status(200).json({
      success: true,
      data: prayers,
    });
  } catch (error) {
    console.error("Get recent prayers error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Internal server error",
      },
    });
  }
};
