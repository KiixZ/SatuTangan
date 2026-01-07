import { Request, Response } from "express";
import { validationResult } from "express-validator";
import authService from "../services/authService";
import emailService from "../services/emailService";

/**
 * Register new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
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

    const { email, password, full_name, phone_number, captcha } = req.body;

    // TODO: Verify captcha with captcha service
    // For now, we'll just check if captcha is provided
    if (!captcha) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_002",
          message: "Captcha verification failed",
        },
      });
      return;
    }

    // Register user
    const { userId, verificationToken } = await authService.register({
      email,
      password,
      full_name,
      phone_number,
    });

    // Auto-verify user for development (remove this in production)
    await authService.verifyEmail(verificationToken);

    // Send verification email (commented out for development)
    // await emailService.sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: "Registration successful! You can now login.",
      data: {
        userId,
      },
    });
  } catch (error: any) {
    if (error.message === "Email already exists") {
      res.status(409).json({
        success: false,
        error: {
          code: "USER_002",
          message: "Email already exists",
        },
      });
      return;
    }

    console.error("Register error:", error);
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
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
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

    const { email, password } = req.body;

    // Login user
    const authResponse = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: authResponse,
    });
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      res.status(401).json({
        success: false,
        error: {
          code: "AUTH_001",
          message: "Invalid credentials",
        },
      });
      return;
    }

    if (error.message === "Email not verified") {
      res.status(403).json({
        success: false,
        error: {
          code: "AUTH_004",
          message:
            "Email not verified. Please check your email to verify your account.",
        },
      });
      return;
    }

    console.error("Login error:", error);
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
 * Verify email
 */
export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_002",
          message: "Verification token is required",
        },
      });
      return;
    }

    await authService.verifyEmail(token);

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error: any) {
    if (
      error.message === "Invalid verification token" ||
      error.message === "Invalid or expired verification token"
    ) {
      res.status(400).json({
        success: false,
        error: {
          code: "AUTH_005",
          message: "Invalid or expired verification token",
        },
      });
      return;
    }

    console.error("Verify email error:", error);
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
 * Forgot password
 */
export const forgotPassword = async (
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

    const { email } = req.body;

    // Request password reset
    const resetToken = await authService.forgotPassword(email);

    // Send reset password email
    await emailService.sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email.",
    });
  } catch (error: any) {
    if (error.message === "User not found") {
      // For security reasons, we don't reveal if email exists or not
      res.status(200).json({
        success: true,
        message: "If the email exists, a password reset link has been sent.",
      });
      return;
    }

    console.error("Forgot password error:", error);
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
 * Reset password
 */
export const resetPassword = async (
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

    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_002",
          message: "Reset token is required",
        },
      });
      return;
    }

    await authService.resetPassword(token, password);

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error: any) {
    if (
      error.message === "Invalid reset token" ||
      error.message === "Invalid or expired verification token"
    ) {
      res.status(400).json({
        success: false,
        error: {
          code: "AUTH_005",
          message: "Invalid or expired reset token",
        },
      });
      return;
    }

    console.error("Reset password error:", error);
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
 * Get current user
 */
export const getCurrentUser = async (
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
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Internal server error",
      },
    });
  }
};
