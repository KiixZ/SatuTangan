import { body, param, query } from "express-validator";

export const createDonationValidator = [
  // Simple validation - we'll handle field mapping in controller
  body("campaignId")
    .optional()
    .isUUID()
    .withMessage("Invalid campaign ID format"),
  body("campaign_id")
    .optional()
    .isUUID()
    .withMessage("Invalid campaign ID format"),
  body("donorName")
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage("Donor name must be between 2 and 255 characters"),
  body("donor_name")
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage("Donor name must be between 2 and 255 characters"),
  body("donorEmail")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("donor_email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("donorPhone")
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage("Invalid phone number format")
    .isLength({ min: 10, max: 20 })
    .withMessage("Phone number must be between 10 and 20 characters"),
  body("donor_phone")
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage("Invalid phone number format")
    .isLength({ min: 10, max: 20 })
    .withMessage("Phone number must be between 10 and 20 characters"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 1000 })
    .withMessage("Minimum donation amount is Rp 1,000"),
  body("prayer")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Prayer must not exceed 1000 characters"),
  body("isAnonymous")
    .optional()
    .isBoolean()
    .withMessage("isAnonymous must be a boolean"),
  body("is_anonymous")
    .optional()
    .isBoolean()
    .withMessage("is_anonymous must be a boolean"),
];

export const getDonationByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Donation ID is required")
    .isUUID()
    .withMessage("Invalid donation ID format"),
];

export const getCampaignDonationsValidator = [
  param("id")
    .notEmpty()
    .withMessage("Campaign ID is required")
    .isUUID()
    .withMessage("Invalid campaign ID format"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

export const getCampaignPrayersValidator = [
  param("id")
    .notEmpty()
    .withMessage("Campaign ID is required")
    .isUUID()
    .withMessage("Invalid campaign ID format"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
