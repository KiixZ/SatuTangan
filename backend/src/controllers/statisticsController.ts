import { Request, Response } from "express";
import statisticsService from "../services/statisticsService";

/**
 * Get analytics data for admin dashboard
 */
export const getAnalyticsData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const analytics = await statisticsService.getAnalyticsData();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Get analytics data error:", error);
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
 * Get platform statistics
 */
export const getPlatformStatistics = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const statistics = await statisticsService.getPlatformStatistics();

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error("Get platform statistics error:", error);
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
 * Get admin dashboard statistics
 */
export const getAdminDashboardStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const statistics = await statisticsService.getAdminDashboardStats();

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error("Get admin dashboard statistics error:", error);
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
 * Get donation trends
 */
export const getDonationTrends = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const trends = await statisticsService.getDonationTrends(days);

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    console.error("Get donation trends error:", error);
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
 * Get recent activities
 */
export const getRecentActivities = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const activities = await statisticsService.getRecentActivities(limit);

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Get recent activities error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Internal server error",
      },
    });
  }
};
