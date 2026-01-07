/**
 * Custom Error Classes for Application
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication Errors
export class AuthenticationError extends AppError {
  constructor(message: string, code: string, details?: any) {
    super(message, 401, code, true, details);
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor(message = 'Invalid credentials') {
    super(message, 'AUTH_001');
  }
}

export class TokenExpiredError extends AuthenticationError {
  constructor(message = 'Token expired') {
    super(message, 'AUTH_002');
  }
}

export class UnauthorizedError extends AuthenticationError {
  constructor(message = 'Unauthorized access') {
    super(message, 'AUTH_003');
  }
}

export class EmailNotVerifiedError extends AuthenticationError {
  constructor(message = 'Email not verified') {
    super(message, 'AUTH_004');
  }
}

export class InvalidResetTokenError extends AuthenticationError {
  constructor(message = 'Invalid reset token') {
    super(message, 'AUTH_005');
  }
}

// Campaign Errors
export class CampaignError extends AppError {
  constructor(message: string, code: string, details?: any) {
    super(message, 404, code, true, details);
  }
}

export class CampaignNotFoundError extends CampaignError {
  constructor(message = 'Campaign not found') {
    super(message, 'CAMPAIGN_001');
  }
}

export class InvalidCampaignStatusError extends AppError {
  constructor(message = 'Invalid campaign status') {
    super(message, 400, 'CAMPAIGN_002');
  }
}

export class UnauthorizedCampaignAccessError extends AppError {
  constructor(message = 'Unauthorized to modify campaign') {
    super(message, 403, 'CAMPAIGN_003');
  }
}

export class CampaignAlreadyExistsError extends AppError {
  constructor(message = 'Campaign already exists') {
    super(message, 409, 'CAMPAIGN_004');
  }
}

// Donation Errors
export class DonationError extends AppError {
  constructor(message: string, code: string, statusCode = 400, details?: any) {
    super(message, statusCode, code, true, details);
  }
}

export class InvalidDonationAmountError extends DonationError {
  constructor(message = 'Invalid donation amount') {
    super(message, 'DONATION_001');
  }
}

export class PaymentFailedError extends DonationError {
  constructor(message = 'Payment failed', details?: any) {
    super(message, 'DONATION_002', 400, details);
  }
}

export class CampaignNotAcceptingDonationsError extends DonationError {
  constructor(message = 'Campaign not accepting donations') {
    super(message, 'DONATION_003');
  }
}

// User Errors
export class UserError extends AppError {
  constructor(message: string, code: string, statusCode = 404, details?: any) {
    super(message, statusCode, code, true, details);
  }
}

export class UserNotFoundError extends UserError {
  constructor(message = 'User not found') {
    super(message, 'USER_001');
  }
}

export class EmailAlreadyExistsError extends UserError {
  constructor(message = 'Email already exists') {
    super(message, 'USER_002', 409);
  }
}

export class InvalidVerificationStatusError extends UserError {
  constructor(message = 'Invalid verification status') {
    super(message, 'USER_003', 400);
  }
}

// Validation Errors
export class ValidationError extends AppError {
  constructor(message: string, code: string, details?: any) {
    super(message, 400, code, true, details);
  }
}

export class InvalidInputError extends ValidationError {
  constructor(message = 'Invalid input data', details?: any) {
    super(message, 'VALIDATION_001', details);
  }
}

export class MissingRequiredFieldsError extends ValidationError {
  constructor(message = 'Missing required fields', details?: any) {
    super(message, 'VALIDATION_002', details);
  }
}

export class FileUploadError extends ValidationError {
  constructor(message = 'File upload failed', details?: any) {
    super(message, 'VALIDATION_003', details);
  }
}

// Server Errors
export class ServerError extends AppError {
  constructor(message: string, code: string, details?: any) {
    super(message, 500, code, false, details);
  }
}

export class InternalServerError extends ServerError {
  constructor(message = 'Internal server error', details?: any) {
    super(message, 'SERVER_001', details);
  }
}

export class DatabaseError extends ServerError {
  constructor(message = 'Database error', details?: any) {
    super(message, 'SERVER_002', details);
  }
}

export class ExternalServiceError extends ServerError {
  constructor(message = 'External service error', details?: any) {
    super(message, 'SERVER_003', details);
  }
}

// Not Found Error
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

// Forbidden Error
export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}
