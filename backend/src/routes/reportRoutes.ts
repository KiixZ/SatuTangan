import { Router } from 'express';
import reportController from '../controllers/reportController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import {
  submitReportValidator,
  getReportsValidator,
  reportIdValidator,
  reviewReportValidator,
} from '../validators/reportValidator';

const router = Router();

/**
 * Public routes
 */

// Submit a report (public - can be authenticated or not)
router.post(
  '/',
  submitReportValidator,
  reportController.submitReport
);

/**
 * Admin routes
 */

// Get all reports (admin only)
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  getReportsValidator,
  reportController.getReports
);

// Get report by ID (admin only)
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  reportIdValidator,
  reportController.getReportById
);

// Review report (admin only)
router.patch(
  '/:id/review',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  reviewReportValidator,
  reportController.reviewReport
);

export default router;
