import { Router } from "express";
import {
  getAllUsers,
  submitVerification,
  getVerificationStatus,
  getAllVerifications,
  reviewVerification,
  getProfile,
  uploadProfilePhoto,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import {
  uploadVerificationDocuments,
  uploadSingle,
} from "../middlewares/uploadMiddleware";
import {
  submitVerificationValidation,
  reviewVerificationValidation,
} from "../validators/verificationValidator";

const router = Router();

// Admin routes - get all users
router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), getAllUsers);

// User profile routes
router.get("/profile", authMiddleware, getProfile);

// Upload profile photo
router.post(
  "/profile/photo",
  authMiddleware,
  uploadSingle("profiles"),
  uploadProfilePhoto,
);

// Verification routes (donor)
router.post(
  "/verification",
  authMiddleware,
  uploadVerificationDocuments,
  submitVerificationValidation,
  submitVerification,
);

router.get("/verification/status", authMiddleware, getVerificationStatus);

// Admin verification routes
router.get(
  "/admin/verifications",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getAllVerifications,
);

router.patch(
  "/admin/verifications/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  reviewVerificationValidation,
  reviewVerification,
);

export default router;
