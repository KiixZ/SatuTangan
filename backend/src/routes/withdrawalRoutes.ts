import { Router } from "express";
import withdrawalController from "../controllers/withdrawalController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import {
  createWithdrawalValidator,
  updateWithdrawalStatusValidator,
  withdrawalIdValidator,
  getWithdrawalsValidator,
  getRecentWithdrawalsValidator,
  campaignIdValidator,
} from "../validators/withdrawalValidator";

const router = Router();

/**
 * Public routes
 */

// GET /api/withdrawals/recent - Get recent withdrawals (public)
router.get(
  "/recent",
  getRecentWithdrawalsValidator,
  withdrawalController.getRecentWithdrawals,
);

/**
 * Creator routes
 */

// POST /api/withdrawals/request - Creator requests withdrawal
router.post(
  "/request",
  authMiddleware,
  roleMiddleware(["CREATOR"]),
  createWithdrawalValidator,
  withdrawalController.requestWithdrawal,
);

// GET /api/withdrawals/my-withdrawals - Get creator's withdrawals
router.get(
  "/my-withdrawals",
  authMiddleware,
  roleMiddleware(["CREATOR"]),
  withdrawalController.getMyWithdrawals,
);

/**
 * Admin routes
 */

// GET /api/withdrawals - Get all withdrawals (admin only)
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getWithdrawalsValidator,
  withdrawalController.getWithdrawals,
);

// GET /api/withdrawals/:id - Get withdrawal by ID (admin only)
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  withdrawalIdValidator,
  withdrawalController.getWithdrawalById,
);

// POST /api/withdrawals - Create withdrawal (admin only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  createWithdrawalValidator,
  withdrawalController.createWithdrawal,
);

// PATCH /api/withdrawals/:id/status - Update withdrawal status (admin only)
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  updateWithdrawalStatusValidator,
  withdrawalController.updateWithdrawalStatus,
);

// GET /api/withdrawals/campaign/:campaignId - Get campaign withdrawals (admin only)
router.get(
  "/campaign/:campaignId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  campaignIdValidator,
  withdrawalController.getCampaignWithdrawals,
);

export default router;
