import { Request, Response } from "express";
import { validationResult } from "express-validator";
import campaignService from "../services/campaignService";
import { fileService } from "../services/fileService";
import {
  InvalidInputError,
  CampaignNotFoundError,
  UnauthorizedCampaignAccessError,
  InternalServerError,
} from "../utils/errors";

export class CampaignController {
  /**
   * Get campaigns with pagination and filters
   */
  async getCampaigns(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_001",
            message: "Invalid input data",
            details: errors.array(),
          },
        });
      }

      const { page, limit, category_id, status, is_emergency, search } =
        req.query;

      const result = await campaignService.getCampaigns({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        category_id: category_id as string,
        status: status as string,
        is_emergency:
          is_emergency === "true"
            ? true
            : is_emergency === "false"
              ? false
              : undefined,
        search: search as string,
      });

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Get campaigns error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Get campaign by ID
   */
  async getCampaignById(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_001",
            message: "Invalid input data",
            details: errors.array(),
          },
        });
      }

      const { id } = req.params;
      const campaign = await campaignService.getCampaignById(id);

      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: campaign,
      });
    } catch (error) {
      console.error("Get campaign by ID error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Create campaign
   */
  async createCampaign(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_001",
            message: "Invalid input data",
            details: errors.array(),
          },
        });
      }

      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: "AUTH_003",
            message: "Unauthorized access",
          },
        });
      }

      const {
        title,
        description,
        category_id,
        target_amount,
        start_date,
        end_date,
        status,
      } = req.body;

      // Process thumbnail if uploaded
      let thumbnailUrl = "";
      if (req.file) {
        thumbnailUrl = await fileService.processAndSaveImage(
          req.file,
          "campaigns",
          {
            maxWidth: 1200,
            maxHeight: 800,
            quality: 80,
          },
        );
      }

      const campaignId = await campaignService.createCampaign({
        title,
        description,
        category_id,
        creator_id: userId,
        target_amount: parseFloat(target_amount),
        thumbnail_url: thumbnailUrl,
        start_date,
        end_date,
        status,
      });

      const campaign = await campaignService.getCampaignById(campaignId);

      return res.status(201).json({
        success: true,
        message: "Campaign created successfully",
        data: campaign,
      });
    } catch (error) {
      console.error("Create campaign error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Update campaign
   */
  async updateCampaign(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_001",
            message: "Invalid input data",
            details: errors.array(),
          },
        });
      }

      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      // Check if campaign exists
      const campaign = await campaignService.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      // Check authorization (creator or admin)
      if (userRole !== "ADMIN" && campaign.creator_id !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: "CAMPAIGN_003",
            message: "Unauthorized to modify campaign",
          },
        });
      }

      const {
        title,
        description,
        category_id,
        target_amount,
        start_date,
        end_date,
        status,
      } = req.body;

      // Process thumbnail if uploaded
      let thumbnailUrl: string | undefined;
      if (req.file) {
        thumbnailUrl = await fileService.processAndSaveImage(
          req.file,
          "campaigns",
          {
            maxWidth: 1200,
            maxHeight: 800,
            quality: 80,
          },
        );
      }

      const updated = await campaignService.updateCampaign(id, {
        title,
        description,
        category_id,
        target_amount: target_amount ? parseFloat(target_amount) : undefined,
        thumbnail_url: thumbnailUrl,
        start_date,
        end_date,
        status,
      });

      if (!updated) {
        return res.status(400).json({
          success: false,
          error: {
            code: "CAMPAIGN_002",
            message: "Failed to update campaign",
          },
        });
      }

      const updatedCampaign = await campaignService.getCampaignById(id);

      return res.status(200).json({
        success: true,
        message: "Campaign updated successfully",
        data: updatedCampaign,
      });
    } catch (error) {
      console.error("Update campaign error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_001",
            message: "Invalid input data",
            details: errors.array(),
          },
        });
      }

      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      // Check if campaign exists
      const campaign = await campaignService.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      // Check authorization (creator or admin)
      if (userRole !== "ADMIN" && campaign.creator_id !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: "CAMPAIGN_003",
            message: "Unauthorized to modify campaign",
          },
        });
      }

      const deleted = await campaignService.deleteCampaign(id);

      if (!deleted) {
        return res.status(400).json({
          success: false,
          error: {
            code: "CAMPAIGN_002",
            message: "Failed to delete campaign",
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Campaign deleted successfully",
      });
    } catch (error) {
      console.error("Delete campaign error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Update campaign status
   */
  async updateCampaignStatus(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_001",
            message: "Invalid input data",
            details: errors.array(),
          },
        });
      }

      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      // Check if campaign exists
      const campaign = await campaignService.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      // Check authorization (creator or admin)
      if (userRole !== "ADMIN" && campaign.creator_id !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: "CAMPAIGN_003",
            message: "Unauthorized to modify campaign",
          },
        });
      }

      const updated = await campaignService.updateCampaignStatus(id, status);

      if (!updated) {
        return res.status(400).json({
          success: false,
          error: {
            code: "CAMPAIGN_002",
            message: "Failed to update campaign status",
          },
        });
      }

      const updatedCampaign = await campaignService.getCampaignById(id);

      return res.status(200).json({
        success: true,
        message: "Campaign status updated successfully",
        data: updatedCampaign,
      });
    } catch (error) {
      console.error("Update campaign status error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Toggle emergency status (admin only)
   */
  async toggleEmergency(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_001",
            message: "Invalid input data",
            details: errors.array(),
          },
        });
      }

      const { id } = req.params;
      const { is_emergency } = req.body;

      // Check if campaign exists
      const campaign = await campaignService.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      const updated = await campaignService.toggleEmergency(id, is_emergency);

      if (!updated) {
        return res.status(400).json({
          success: false,
          error: {
            code: "CAMPAIGN_002",
            message: "Failed to update emergency status",
          },
        });
      }

      const updatedCampaign = await campaignService.getCampaignById(id);

      return res.status(200).json({
        success: true,
        message: "Emergency status updated successfully",
        data: updatedCampaign,
      });
    } catch (error) {
      console.error("Toggle emergency error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const campaign = await campaignService.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      const stats = await campaignService.getCampaignStats(id);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Get campaign stats error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Upload campaign photos
   */
  async uploadCampaignPhotos(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      // Check if campaign exists
      const campaign = await campaignService.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      // Check authorization (creator only)
      if (userRole !== "ADMIN" && campaign.creator_id !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: "CAMPAIGN_003",
            message: "Unauthorized to modify campaign",
          },
        });
      }

      // Check if files were uploaded
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_003",
            message: "No files uploaded",
          },
        });
      }

      // Process and save images using fileService
      const photoUrls = await fileService.processAndSaveMultipleImages(
        req.files as Express.Multer.File[],
        "campaigns",
        {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 80,
        },
      );

      // Save photos to database
      await Promise.all(
        photoUrls.map((url) => campaignService.addCampaignPhoto(id, url)),
      );

      // Get all photos for this campaign
      const photos = await campaignService.getCampaignPhotos(id);

      return res.status(201).json({
        success: true,
        message: "Photos uploaded successfully",
        data: photos,
      });
    } catch (error) {
      console.error("Upload campaign photos error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Get campaign photos
   */
  async getCampaignPhotos(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const campaign = await campaignService.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      const photos = await campaignService.getCampaignPhotos(id);

      return res.status(200).json({
        success: true,
        data: photos,
      });
    } catch (error) {
      console.error("Get campaign photos error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Delete campaign photo
   */
  async deleteCampaignPhoto(req: Request, res: Response) {
    try {
      const { id, photoId } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      // Check if campaign exists
      const campaign = await campaignService.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      // Check authorization (creator only)
      if (userRole !== "ADMIN" && campaign.creator_id !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: "CAMPAIGN_003",
            message: "Unauthorized to modify campaign",
          },
        });
      }

      // Check if photo exists and belongs to campaign
      const photo = await campaignService.getPhotoById(photoId);
      if (!photo) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Photo not found",
          },
        });
      }

      if ((photo as any).campaign_id !== id) {
        return res.status(400).json({
          success: false,
          error: {
            code: "CAMPAIGN_002",
            message: "Photo does not belong to this campaign",
          },
        });
      }

      // Delete photo from database
      const deleted = await campaignService.deleteCampaignPhoto(photoId);

      if (!deleted) {
        return res.status(400).json({
          success: false,
          error: {
            code: "CAMPAIGN_002",
            message: "Failed to delete photo",
          },
        });
      }

      // Delete physical file from storage
      await fileService.deleteFile((photo as any).photo_url);

      return res.status(200).json({
        success: true,
        message: "Photo deleted successfully",
      });
    } catch (error) {
      console.error("Delete campaign photo error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Post campaign update
   */
  async postCampaignUpdate(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_001",
            message: "Invalid input data",
            details: errors.array(),
          },
        });
      }

      const { id } = req.params;
      const { title, description } = req.body;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      // Check if campaign exists
      const campaign = await campaignService.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      // Check authorization (creator only)
      if (userRole !== "ADMIN" && campaign.creator_id !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: "CAMPAIGN_003",
            message: "Unauthorized to modify campaign",
          },
        });
      }

      // Process photo if uploaded
      let photoUrl: string | undefined;
      if (req.file) {
        photoUrl = await fileService.processAndSaveImage(
          req.file,
          "campaigns",
          {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 80,
          },
        );
      }

      // Add update to database
      const updateId = await campaignService.addCampaignUpdate(
        id,
        title,
        description,
        photoUrl,
        false,
      );

      // Get the created update
      const update = await campaignService.getUpdateById(updateId);

      return res.status(201).json({
        success: true,
        message: "Campaign update posted successfully",
        data: update,
      });
    } catch (error) {
      console.error("Post campaign update error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }

  /**
   * Get campaign updates
   */
  async getCampaignUpdates(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const campaign = await campaignService.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: {
            code: "CAMPAIGN_001",
            message: "Campaign not found",
          },
        });
      }

      const updates = await campaignService.getCampaignUpdates(id);

      return res.status(200).json({
        success: true,
        data: updates,
      });
    } catch (error) {
      console.error("Get campaign updates error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_001",
          message: "Internal server error",
        },
      });
    }
  }
}

export default new CampaignController();
