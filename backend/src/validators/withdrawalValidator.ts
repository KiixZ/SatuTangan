import { body, param, query } from 'express-validator';

export const createWithdrawalValidator = [
  body('campaign_id')
    .trim()
    .notEmpty()
    .withMessage('Campaign ID is required')
    .isUUID()
    .withMessage('Invalid campaign ID'),

  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 1000 })
    .withMessage('Amount must be at least 1000'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Note must not exceed 1000 characters'),
];

export const updateWithdrawalStatusValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Withdrawal ID is required'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['PROCESSING', 'COMPLETED', 'FAILED'])
    .withMessage('Invalid status'),
];

export const withdrawalIdValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Withdrawal ID is required'),
];

export const getWithdrawalsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('campaign_id')
    .optional()
    .trim()
    .isUUID()
    .withMessage('Invalid campaign ID'),

  query('status')
    .optional()
    .isIn(['PROCESSING', 'COMPLETED', 'FAILED'])
    .withMessage('Invalid status'),
];

export const getRecentWithdrawalsValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
];

export const campaignIdValidator = [
  param('campaignId')
    .trim()
    .notEmpty()
    .withMessage('Campaign ID is required')
    .isUUID()
    .withMessage('Invalid campaign ID'),
];
