import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if user has required role(s)
 */
export const roleMiddleware = (allowedRoles: ('DONOR' | 'CREATOR' | 'ADMIN')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_003',
            message: 'Unauthorized access. Please login first.',
          },
        });
        return;
      }

      // Check if user has required role
      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          error: {
            code: 'AUTH_003',
            message: 'Forbidden. You do not have permission to access this resource.',
          },
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_001',
          message: 'Internal server error',
        },
      });
    }
  };
};

/**
 * Middleware to check if user is a donor
 */
export const isDonor = roleMiddleware(['DONOR', 'CREATOR', 'ADMIN']);

/**
 * Middleware to check if user is a creator
 */
export const isCreator = roleMiddleware(['CREATOR', 'ADMIN']);

/**
 * Middleware to check if user is an admin
 */
export const isAdmin = roleMiddleware(['ADMIN']);
