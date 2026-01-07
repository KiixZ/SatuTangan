import { body, param } from 'express-validator';

export const createBannerValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title must not exceed 255 characters'),

  body('description')
    .optional()
    .trim(),

  body('link_url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Link URL must be a valid URL'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
];

export const updateBannerValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Banner ID is required'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 255 })
    .withMessage('Title must not exceed 255 characters'),

  body('description')
    .optional()
    .trim(),

  body('link_url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Link URL must be a valid URL'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
];

export const bannerIdValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Banner ID is required'),
];
