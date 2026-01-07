import { Router } from "express";
import {
  getPrayers,
  getPrayerCount,
  getRecentPrayers,
} from "../controllers/prayerController";

const router = Router();

/**
 * @route   GET /api/prayers
 * @desc    Get all prayers with pagination
 * @access  Public
 */
router.get("/", getPrayers);

/**
 * @route   GET /api/prayers/recent
 * @desc    Get recent prayers for homepage
 * @access  Public
 */
router.get("/recent", getRecentPrayers);

/**
 * @route   GET /api/prayers/campaign/:campaign_id/count
 * @desc    Get prayer count for a campaign
 * @access  Public
 */
router.get("/campaign/:campaign_id/count", getPrayerCount);

export default router;
