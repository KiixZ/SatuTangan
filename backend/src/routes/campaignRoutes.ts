import { Router } from "express";
import campaignController from "../controllers/campaignController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import {
  uploadCampaignPhotos,
  uploadSingle,
} from "../middlewares/uploadMiddleware";
import {
  createCampaignValidator,
  updateCampaignValidator,
  campaignIdValidator,
  updateStatusValidator,
  toggleEmergencyValidator,
  getCampaignsValidator,
  photoIdValidator,
  createUpdateValidator,
} from "../validators/campaignValidator";

const router = Router();

// Public routes
router.get("/", getCampaignsValidator, campaignController.getCampaigns);

router.get("/:id", campaignIdValidator, campaignController.getCampaignById);

router.get(
  "/:id/statistics",
  campaignIdValidator,
  campaignController.getCampaignStats,
);

// Protected routes - Creator/Admin
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["CREATOR", "ADMIN"]),
  uploadSingle("thumbnail"),
  createCampaignValidator,
  campaignController.createCampaign,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["CREATOR", "ADMIN"]),
  uploadSingle("thumbnail"),
  updateCampaignValidator,
  campaignController.updateCampaign,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["CREATOR", "ADMIN"]),
  campaignIdValidator,
  campaignController.deleteCampaign,
);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["CREATOR", "ADMIN"]),
  updateStatusValidator,
  campaignController.updateCampaignStatus,
);

// Admin only routes
router.patch(
  "/:id/emergency",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  toggleEmergencyValidator,
  campaignController.toggleEmergency,
);

// Photo management routes
router.post(
  "/:id/photos",
  authMiddleware,
  roleMiddleware(["CREATOR", "ADMIN"]),
  uploadCampaignPhotos,
  campaignController.uploadCampaignPhotos,
);

router.get(
  "/:id/photos",
  campaignIdValidator,
  campaignController.getCampaignPhotos,
);

router.delete(
  "/:id/photos/:photoId",
  authMiddleware,
  roleMiddleware(["CREATOR", "ADMIN"]),
  photoIdValidator,
  campaignController.deleteCampaignPhoto,
);

// Campaign update routes
router.post(
  "/:id/updates",
  authMiddleware,
  roleMiddleware(["CREATOR", "ADMIN"]),
  uploadSingle("photo"),
  createUpdateValidator,
  campaignController.postCampaignUpdate,
);

router.get(
  "/:id/updates",
  campaignIdValidator,
  campaignController.getCampaignUpdates,
);

// Donation-related routes for campaigns
import * as donationController from "../controllers/donationController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import {
  getCampaignDonationsValidator,
  getCampaignPrayersValidator,
} from "../validators/donationValidator";

router.get(
  "/:id/donations",
  getCampaignDonationsValidator,
  validationMiddleware,
  donationController.getCampaignDonations,
);

router.get(
  "/:id/prayers",
  getCampaignPrayersValidator,
  validationMiddleware,
  donationController.getCampaignPrayers,
);

export default router;
