import { body, ValidationChain } from 'express-validator';

/**
 * Validation rules for submitting verification
 */
export const submitVerificationValidation: ValidationChain[] = [
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Full name must be between 2 and 255 characters'),
  body('ktp_name')
    .trim()
    .notEmpty()
    .withMessage('KTP name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('KTP name must be between 2 and 255 characters'),
  body('ktp_number')
    .trim()
    .notEmpty()
    .withMessage('KTP number is required')
    .matches(/^[0-9]{16}$/)
    .withMessage('KTP number must be 16 digits'),
  body('account_number')
    .trim()
    .notEmpty()
    .withMessage('Account number is required')
    .matches(/^[0-9]+$/)
    .withMessage('Account number must contain only digits'),
  body('bank_name')
    .trim()
    .notEmpty()
    .withMessage('Bank name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Bank name must be between 2 and 100 characters'),
];

/**
 * Validation rules for reviewing verification
 */
export const reviewVerificationValidation: ValidationChain[] = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['APPROVED', 'REJECTED'])
    .withMessage('Status must be either APPROVED or REJECTED'),
  body('rejection_reason')
    .if(body('status').equals('REJECTED'))
    .notEmpty()
    .withMessage('Rejection reason is required when rejecting verification')
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason must be between 10 and 500 characters'),
];
