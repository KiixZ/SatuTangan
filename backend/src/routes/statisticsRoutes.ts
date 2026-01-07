import { Router } from "express";
import {
  getPlatformStatistics,
  getAdminDashboardStats,
  getDonationTrends,
  getRecentActivities,
  getAnalyticsData,
} from "../controllers/statisticsController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/roleMiddleware";

const router = Router();

/**
 * @route GET /api/statistics/platform
 * @desc Get platform statistics (total campaigns, donors, funds)
 * @access Public
 */
router.get("/platform", getPlatformStatistics);

/**
 * @route GET /api/statistics/admin/dashboard
 * @desc Get admin dashboard statistics
 * @access Admin only
 */
router.get("/admin/dashboard", authMiddleware, isAdmin, getAdminDashboardStats);

/**
 * @route GET /api/statistics/admin/dashboard/trends
 * @desc Get donation trends for admin dashboard
 * @access Admin only
 */
router.get(
  "/admin/dashboard/trends",
  authMiddleware,
  isAdmin,
  getDonationTrends,
);

/**
 * @route GET /api/statistics/admin/dashboard/activities
 * @desc Get recent activities for admin dashboard
 * @access Admin only
 */
router.get(
  "/admin/dashboard/activities",
  authMiddleware,
  isAdmin,
  getRecentActivities,
);

/**
 * @route GET /api/statistics/admin/dashboard/analytics
 * @desc Get analytics data for admin dashboard
 * @access Admin only
 */
router.get(
  "/admin/dashboard/analytics",
  authMiddleware,
  isAdmin,
  getAnalyticsData,
);

export default router;
