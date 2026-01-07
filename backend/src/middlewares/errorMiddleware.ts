import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Error response interface
 */
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Centralized error handling middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let errorCode = 'SERVER_001';
  let message = 'Internal server error';
  let details: any = undefined;
  let isOperational = false;

  // Check if it's an AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.code;
    message = err.message;
    details = err.details;
    isOperational = err.isOperational;
  } else {
    // Handle known error types
    if (err.name === 'ValidationError') {
      statusCode = 400;
      errorCode = 'VALIDATION_001';
      message = err.message;
      isOperational = true;
    } else if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      errorCode = 'AUTH_002';
      message = 'Invalid token';
      isOperational = true;
    } else if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      errorCode = 'AUTH_002';
      message = 'Token expired';
      isOperational = true;
    } else if (err.name === 'MulterError') {
      statusCode = 400;
      errorCode = 'VALIDATION_003';
      message = `File upload error: ${err.message}`;
      isOperational = true;
    }
  }

  // Log error
  const logMessage = `${req.method} ${req.path} - ${errorCode}: ${message}`;
  if (isOperational) {
    logger.warn(logMessage, {
      statusCode,
      errorCode,
      userId: req.user?.userId,
      ip: req.ip,
      details,
    });
  } else {
    logger.error(logMessage, err);
  }

  // Don't expose internal error details in production
  if (process.env.NODE_ENV === 'production' && !isOperational) {
    message = 'Internal server error';
    details = undefined;
  }

  // Send error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details && { details }),
    },
  };

  res.status(statusCode).json(errorResponse);
};

/**
 * Handle 404 Not Found errors
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const message = `Route not found: ${req.method} ${req.path}`;
  logger.warn(message, { ip: req.ip });

  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found',
    },
  });
};

/**
 * Async error wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Request logging middleware
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.logRequest(req.method, req.path, res.statusCode, duration);
  });

  next();
};
