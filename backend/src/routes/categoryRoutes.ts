import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import {
  createCategoryValidation,
  updateCategoryValidation,
} from '../validators/categoryValidator';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', getCategoryById);

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  createCategoryValidation,
  createCategory
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  updateCategoryValidation,
  updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  deleteCategory
);

export default router;
