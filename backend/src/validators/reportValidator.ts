import { body, param, query } from 'express-validator';

export const submitReportValidator = [
  body('campaign_id')
    .trim()
    .notEmpty()
    .withMessage('Campaign ID is required')
    .isUUID()
    .withMessage('Invalid campaign ID'),

  body('reporter_email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ min: 5, max: 255 })
    .withMessage('Reason must be between 5 and 255 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
];

export const getReportsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('status')
    .optional()
    .isIn(['PENDING', 'REVIEWED', 'REJECTED'])
    .withMessage('Invalid status'),

  query('campaign_id')
    .optional()
    .trim()
    .isUUID()
    .withMessage('Invalid campaign ID'),
];

export const reportIdValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Report ID is required')
    .isUUID()
    .withMessage('Invalid report ID'),
];

export const reviewReportValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Report ID is required')
    .isUUID()
    .withMessage('Invalid report ID'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['REVIEWED', 'REJECTED'])
    .withMessage('Status must be either REVIEWED or REJECTED'),

  body('action')
    .notEmpty()
    .withMessage('Action is required')
    .isIn(['WARNING', 'SUSPEND', 'REJECT'])
    .withMessage('Action must be WARNING, SUSPEND, or REJECT'),

  body('admin_note')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Admin note must be between 10 and 1000 characters'),
];
