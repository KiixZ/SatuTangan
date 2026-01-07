import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from "../controllers/authController";
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from "../validators/authValidator";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user with captcha validation
 * @access  Public
 */
router.post("/register", registerValidation, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", loginValidation, login);

/**
 * @route   POST /api/auth/verify-email/:token
 * @desc    Verify email with token
 * @access  Public
 */
router.post("/verify-email/:token", verifyEmail);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password with token
 * @access  Public
 */
router.post("/reset-password/:token", resetPasswordValidation, resetPassword);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get("/me", authMiddleware, getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (clear tokens on client side)
 * @access  Private
 */
router.post("/logout", authMiddleware, (req, res) => {
  // Since we're using JWT tokens, logout is handled client-side
  // This endpoint just confirms the logout action
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;
