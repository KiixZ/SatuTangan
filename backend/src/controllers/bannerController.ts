import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bannerService from '../services/bannerService';
import { fileService } from '../services/fileService';

class BannerController {
  /**
   * Get all active banners (public)
   */
  async getActiveBanners(req: Request, res: Response): Promise<void> {
    try {
      const banners = await bannerService.getActiveBanners();

      res.json({
        success: true,
        data: banners,
      });
    } catch (error) {
      console.error('Get active banners error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_001',
          message: 'Failed to fetch banners',
        },
      });
    }
  }

  /**
   * Get all banners (admin)
   */
  async getAllBanners(req: Request, res: Response): Promise<void> {
    try {
      const banners = await bannerService.getAllBanners();

      res.json({
        success: true,
        data: banners,
      });
    } catch (error) {
      console.error('Get all banners error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_001',
          message: 'Failed to fetch banners',
        },
      });
    }
  }

  /**
   * Get banner by ID
   */
  async getBannerById(req: Request, res: Response): Promise<void> {
    try {
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
      const banner = await bannerService.getBannerById(id);

      if (!banner) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BANNER_001',
            message: 'Banner not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: banner,
      });
    } catch (error) {
      console.error('Get banner by ID error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_001',
          message: 'Failed to fetch banner',
        },
      });
    }
  }

  /**
   * Create new banner (admin)
   */
  async createBanner(req: Request, res: Response): Promise<void> {
    try {
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

      // Check if file was uploaded
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_002',
            message: 'Banner image is required',
          },
        });
        return;
      }

      // Process and save image
      const imageUrl = await fileService.processAndSaveImage(
        req.file,
        'banners',
        {
          maxWidth: 1920,
          maxHeight: 600,
          quality: 85,
        }
      );

      // Create banner
      const bannerId = await bannerService.createBanner({
        title: req.body.title,
        description: req.body.description,
        image_url: imageUrl,
        link_url: req.body.link_url,
        is_active: req.body.is_active !== undefined ? req.body.is_active === 'true' : true,
      });

      const banner = await bannerService.getBannerById(bannerId);

      res.status(201).json({
        success: true,
        message: 'Banner created successfully',
        data: banner,
      });
    } catch (error) {
      console.error('Create banner error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_001',
          message: 'Failed to create banner',
        },
      });
    }
  }

  /**
   * Update banner (admin)
   */
  async updateBanner(req: Request, res: Response): Promise<void> {
    try {
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
      const updateData: any = {};

      if (req.body.title) {
        updateData.title = req.body.title;
      }

      if (req.body.description !== undefined) {
        updateData.description = req.body.description;
      }

      if (req.body.link_url !== undefined) {
        updateData.link_url = req.body.link_url;
      }

      if (req.body.is_active !== undefined) {
        updateData.is_active = req.body.is_active === 'true';
      }

      // Process new image if uploaded
      if (req.file) {
        const imageUrl = await fileService.processAndSaveImage(
          req.file,
          'banners',
          {
            maxWidth: 1920,
            maxHeight: 600,
            quality: 85,
          }
        );
        updateData.image_url = imageUrl;
      }

      const success = await bannerService.updateBanner(id, updateData);

      if (!success) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BANNER_001',
            message: 'Banner not found',
          },
        });
        return;
      }

      const banner = await bannerService.getBannerById(id);

      res.json({
        success: true,
        message: 'Banner updated successfully',
        data: banner,
      });
    } catch (error) {
      console.error('Update banner error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_001',
          message: 'Failed to update banner',
        },
      });
    }
  }

  /**
   * Delete banner (admin)
   */
  async deleteBanner(req: Request, res: Response): Promise<void> {
    try {
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
      const success = await bannerService.deleteBanner(id);

      if (!success) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BANNER_001',
            message: 'Banner not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Banner deleted successfully',
      });
    } catch (error) {
      console.error('Delete banner error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_001',
          message: 'Failed to delete banner',
        },
      });
    }
  }

  /**
   * Toggle banner status (admin)
   */
  async toggleBannerStatus(req: Request, res: Response): Promise<void> {
    try {
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
      const success = await bannerService.toggleBannerStatus(id);

      if (!success) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BANNER_001',
            message: 'Banner not found',
          },
        });
        return;
      }

      const banner = await bannerService.getBannerById(id);

      res.json({
        success: true,
        message: 'Banner status updated successfully',
        data: banner,
      });
    } catch (error) {
      console.error('Toggle banner status error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_001',
          message: 'Failed to update banner status',
        },
      });
    }
  }
}

export default new BannerController();
