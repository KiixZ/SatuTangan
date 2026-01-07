import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import categoryService from '../services/categoryService';

/**
 * Get all categories
 */
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error',
      },
    });
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await categoryService.getCategoryById(id);

    if (!category) {
      res.status(404).json({
        success: false,
        error: {
          code: 'CATEGORY_001',
          message: 'Category not found',
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        category,
      },
    });
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error',
      },
    });
  }
};

/**
 * Create new category (Admin only)
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Invalid input data',
          details: errors.array(),
        },
      });
      return;
    }

    const { name, description, icon_url, sdgs_ref } = req.body;

    const category = await categoryService.createCategory({
      name,
      description,
      icon_url,
      sdgs_ref,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        category,
      },
    });
  } catch (error: any) {
    if (error.message === 'Category name already exists') {
      res.status(409).json({
        success: false,
        error: {
          code: 'CATEGORY_002',
          message: 'Category name already exists',
        },
      });
      return;
    }

    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error',
      },
    });
  }
};

/**
 * Update category (Admin only)
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Invalid input data',
          details: errors.array(),
        },
      });
      return;
    }

    const { id } = req.params;
    const { name, description, icon_url, sdgs_ref } = req.body;

    const category = await categoryService.updateCategory(id, {
      name,
      description,
      icon_url,
      sdgs_ref,
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: {
        category,
      },
    });
  } catch (error: any) {
    if (error.message === 'Category not found') {
      res.status(404).json({
        success: false,
        error: {
          code: 'CATEGORY_001',
          message: 'Category not found',
        },
      });
      return;
    }

    if (error.message === 'Category name already exists') {
      res.status(409).json({
        success: false,
        error: {
          code: 'CATEGORY_002',
          message: 'Category name already exists',
        },
      });
      return;
    }

    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error',
      },
    });
  }
};

/**
 * Delete category (Admin only)
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if category is in use
    const isInUse = await categoryService.isCategoryInUse(id);
    if (isInUse) {
      res.status(409).json({
        success: false,
        error: {
          code: 'CATEGORY_003',
          message: 'Cannot delete category that is being used by campaigns',
        },
      });
      return;
    }

    await categoryService.deleteCategory(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Category not found') {
      res.status(404).json({
        success: false,
        error: {
          code: 'CATEGORY_001',
          message: 'Category not found',
        },
      });
      return;
    }

    if (error.message === 'Cannot delete category that is being used by campaigns') {
      res.status(409).json({
        success: false,
        error: {
          code: 'CATEGORY_003',
          message: 'Cannot delete category that is being used by campaigns',
        },
      });
      return;
    }

    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error',
      },
    });
  }
};
