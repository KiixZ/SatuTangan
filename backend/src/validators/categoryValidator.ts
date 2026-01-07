import { body, ValidationChain } from 'express-validator';

/**
 * Validation rules for creating a category
 */
export const createCategoryValidation: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Category name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('icon_url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Icon URL must be a valid URL')
    .isLength({ max: 500 })
    .withMessage('Icon URL must not exceed 500 characters'),
  body('sdgs_ref')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('SDGs reference must not exceed 100 characters'),
];

/**
 * Validation rules for updating a category
 */
export const updateCategoryValidation: ValidationChain[] = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category name cannot be empty')
    .isLength({ min: 2, max: 255 })
    .withMessage('Category name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('icon_url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Icon URL must be a valid URL')
    .isLength({ max: 500 })
    .withMessage('Icon URL must not exceed 500 characters'),
  body('sdgs_ref')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('SDGs reference must not exceed 100 characters'),
];
