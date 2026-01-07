import { Router } from 'express';
import bannerController from '../controllers/bannerController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { uploadSingle } from '../middlewares/uploadMiddleware';
import {
  createBannerValidator,
  updateBannerValidator,
  bannerIdValidator,
} from '../validators/bannerValidator';

const router = Router();

// Public routes
router.get('/', bannerController.getActiveBanners);
router.get('/:id', bannerIdValidator, bannerController.getBannerById);

// Admin routes
router.get(
  '/all/list',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  bannerController.getAllBanners
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  uploadSingle('image'),
  createBannerValidator,
  bannerController.createBanner
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  uploadSingle('image'),
  updateBannerValidator,
  bannerController.updateBanner
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  bannerIdValidator,
  bannerController.deleteBanner
);

router.patch(
  '/:id/toggle',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  bannerIdValidator,
  bannerController.toggleBannerStatus
);

export default router;
