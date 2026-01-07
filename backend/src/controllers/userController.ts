import { Request, Response } from "express";
import { validationResult } from "express-validator";
import verificationService from "../services/verificationService";
import { fileService } from "../services/fileService";
import emailService from "../services/emailService";
import authService from "../services/authService";

/**
 * Get all users (admin)
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { page, limit, role, status, search } = req.query;

    const result = await authService.getAllUsers({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      role: role as string | undefined,
      status: status as string | undefined,
      search: search as string | undefined,
    });

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get all users error:", error);
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
 * Submit verification request
 */
export const submitVerification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_001",
          message: "Invalid input data",
          details: errors.array(),
        },
      });
      return;
    }

    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          code: "AUTH_003",
          message: "Unauthorized access",
        },
      });
      return;
    }

    // Check if files are uploaded
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (
      !files ||
      !files.ktp_photo ||
      !files.bank_account_photo ||
      !files.terms_photo
    ) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_002",
          message:
            "All document photos are required (KTP, bank account, terms)",
        },
      });
      return;
    }

    // Process and save files
    const ktpPhotoUrl = await fileService.processAndSaveImage(
      files.ktp_photo[0],
      "verifications",
    );
    const bankAccountPhotoUrl = await fileService.processAndSaveImage(
      files.bank_account_photo[0],
      "verifications",
    );
    const termsPhotoUrl = await fileService.processAndSaveImage(
      files.terms_photo[0],
      "verifications",
    );

    const { full_name, ktp_name, ktp_number, account_number, bank_name } =
      req.body;

    // Submit verification
    const verificationId = await verificationService.submitVerification({
      userId,
      full_name,
      ktp_name,
      ktp_number,
      ktp_photo_url: ktpPhotoUrl,
      bank_account_photo_url: bankAccountPhotoUrl,
      account_number,
      bank_name,
      terms_photo_url: termsPhotoUrl,
    });

    res.status(201).json({
      success: true,
      message: "Verification request submitted successfully",
      data: {
        verificationId,
      },
    });
  } catch (error: any) {
    console.error("Submit verification error:", error);

    if (error.message === "User not found") {
      res.status(404).json({
        success: false,
        error: {
          code: "USER_001",
          message: "User not found",
        },
      });
      return;
    }

    if (error.message === "Verification request already pending") {
      res.status(409).json({
        success: false,
        error: {
          code: "USER_003",
          message: "Verification request already pending",
        },
      });
      return;
    }

    if (error.message === "User already verified as creator") {
      res.status(409).json({
        success: false,
        error: {
          code: "USER_003",
          message: "User already verified as creator",
        },
      });
      return;
    }

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
 * Get verification status
 */
export const getVerificationStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          code: "AUTH_003",
          message: "Unauthorized access",
        },
      });
      return;
    }

    const verification =
      await verificationService.getVerificationStatus(userId);

    if (!verification) {
      res.status(404).json({
        success: false,
        error: {
          code: "USER_003",
          message: "No verification request found",
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        verification,
      },
    });
  } catch (error) {
    console.error("Get verification status error:", error);
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
 * Get all verifications (admin)
 */
export const getAllVerifications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { status } = req.query;

    const verifications = await verificationService.getAllVerifications(
      status as string | undefined,
    );

    res.status(200).json({
      success: true,
      data: {
        verifications,
      },
    });
  } catch (error) {
    console.error("Get all verifications error:", error);
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
 * Review verification (admin)
 */
export const reviewVerification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_001",
          message: "Invalid input data",
          details: errors.array(),
        },
      });
      return;
    }

    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    // Get verification details before review
    const verification = await verificationService.getVerificationById(id);
    if (!verification) {
      res.status(404).json({
        success: false,
        error: {
          code: "USER_003",
          message: "Verification not found",
        },
      });
      return;
    }

    // Review verification
    await verificationService.reviewVerification({
      verificationId: id,
      status,
      rejection_reason,
    });

    // Get user email for notification
    const user = await authService.getUserById(verification.user_id);
    if (user) {
      // Send email notification
      if (status === "APPROVED") {
        await emailService.sendVerificationApprovedEmail(
          user.email,
          user.full_name,
        );
      } else {
        await emailService.sendVerificationRejectedEmail(
          user.email,
          user.full_name,
          rejection_reason || "Verification rejected",
        );
      }
    }

    res.status(200).json({
      success: true,
      message: `Verification ${status.toLowerCase()} successfully`,
    });
  } catch (error: any) {
    console.error("Review verification error:", error);

    if (error.message === "Verification not found") {
      res.status(404).json({
        success: false,
        error: {
          code: "USER_003",
          message: "Verification not found",
        },
      });
      return;
    }

    if (error.message === "Verification already reviewed") {
      res.status(409).json({
        success: false,
        error: {
          code: "USER_003",
          message: "Verification already reviewed",
        },
      });
      return;
    }

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
 * Get user profile
 */
export const getProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          code: "AUTH_003",
          message: "Unauthorized access",
        },
      });
      return;
    }

    const user = await authService.getUserById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          code: "USER_001",
          message: "User not found",
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
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
 * Upload profile photo
 */
export const uploadProfilePhoto = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          code: "AUTH_003",
          message: "Unauthorized access",
        },
      });
      return;
    }

    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: {
          code: "UPLOAD_001",
          message: "No file uploaded",
        },
      });
      return;
    }

    console.log("Processing profile photo upload for user:", userId);
    console.log("File info:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Get current user profile to check for existing photo
    const currentUser = await authService.getUserById(userId);
    const oldPhotoUrl = currentUser?.profile_photo_url;

    // Process and save the image using FileService
    const photoUrl = await fileService.processAndSaveImage(
      req.file,
      "profiles",
      {
        maxWidth: 500,
        maxHeight: 500,
        quality: 85,
      },
    );

    console.log("Profile photo saved at:", photoUrl);

    // Update user profile photo in database
    const updated = await authService.updateProfilePhoto(userId, photoUrl);

    // Delete old photo if exists and upload was successful
    if (updated && oldPhotoUrl && oldPhotoUrl !== photoUrl) {
      console.log("Deleting old profile photo:", oldPhotoUrl);
      await fileService.deleteFile(oldPhotoUrl).catch((err) => {
        console.error("Failed to delete old profile photo:", err);
        // Don't fail the request if deletion fails
      });
    }

    if (!updated) {
      res.status(500).json({
        success: false,
        error: {
          code: "USER_002",
          message: "Failed to update profile photo",
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      data: {
        profile_photo_url: photoUrl,
      },
    });
  } catch (error) {
    console.error("Upload profile photo error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Internal server error",
      },
    });
  }
};
