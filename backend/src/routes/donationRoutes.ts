import { Router } from "express";
import * as donationController from "../controllers/donationController";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/roleMiddleware";
import {
  createDonationValidator,
  getDonationByIdValidator,
} from "../validators/donationValidator";

const router = Router();

// Validation middleware
const validate = (req: any, res: any, next: any) => {
  const { validationResult } = require("express-validator");
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
  next();
};

// Public routes (with optional auth for logged-in users)
router.post(
  "/",
  optionalAuthMiddleware,
  createDonationValidator,
  validate,
  donationController.createDonation,
);

router.get(
  "/:id",
  getDonationByIdValidator,
  validate,
  donationController.getDonationById,
);

router.get("/order/:orderId", donationController.getDonationByOrderId);

// Protected routes (require authentication)
router.get(
  "/user/history",
  authMiddleware,
  donationController.getUserDonationHistory,
);

// Admin routes
router.post(
  "/admin/recalculate",
  authMiddleware,
  isAdmin,
  donationController.recalculateCollectedAmounts,
);

router.post(
  "/admin/recalculate/:campaignId",
  authMiddleware,
  isAdmin,
  donationController.recalculateSingleCampaign,
);

export default router;
