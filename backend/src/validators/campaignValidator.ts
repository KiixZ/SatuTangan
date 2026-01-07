import { body, param, query } from 'express-validator';

export const createCampaignValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 255 })
    .withMessage('Title must be between 5 and 255 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),
  
  body('category_id')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isUUID()
    .withMessage('Invalid category ID'),
  
  body('target_amount')
    .notEmpty()
    .withMessage('Target amount is required')
    .isFloat({ min: 1000 })
    .withMessage('Target amount must be at least 1000'),
  
  body('start_date')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Invalid start date format'),
  
  body('end_date')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('Invalid end date format')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.start_date);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('status')
    .optional()
    .isIn(['DRAFT', 'ACTIVE'])
    .withMessage('Status must be either DRAFT or ACTIVE'),
];

export const updateCampaignValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Campaign ID is required'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('Title must be between 5 and 255 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),
  
  body('category_id')
    .optional()
    .trim()
    .isUUID()
    .withMessage('Invalid category ID'),
  
  body('target_amount')
    .optional()
    .isFloat({ min: 1000 })
    .withMessage('Target amount must be at least 1000'),
  
  body('start_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  
  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),
  
  body('status')
    .optional()
    .isIn(['DRAFT', 'ACTIVE', 'COMPLETED', 'SUSPENDED'])
    .withMessage('Invalid status'),
];

export const campaignIdValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Campaign ID is required'),
];

export const updateStatusValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Campaign ID is required'),
  
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['DRAFT', 'ACTIVE', 'COMPLETED', 'SUSPENDED'])
    .withMessage('Invalid status'),
];

export const toggleEmergencyValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Campaign ID is required'),
  
  body('is_emergency')
    .notEmpty()
    .withMessage('Emergency status is required')
    .isBoolean()
    .withMessage('Emergency status must be a boolean'),
];

export const getCampaignsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('category_id')
    .optional()
    .trim()
    .isUUID()
    .withMessage('Invalid category ID'),
  
  query('status')
    .optional()
    .isIn(['DRAFT', 'ACTIVE', 'COMPLETED', 'SUSPENDED'])
    .withMessage('Invalid status'),
  
  query('is_emergency')
    .optional()
    .isBoolean()
    .withMessage('is_emergency must be a boolean'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Search query must be between 1 and 255 characters'),
];

export const photoIdValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Campaign ID is required'),
  
  param('photoId')
    .trim()
    .notEmpty()
    .withMessage('Photo ID is required'),
];

export const createUpdateValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Campaign ID is required'),
  
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 255 })
    .withMessage('Title must be between 5 and 255 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
];
