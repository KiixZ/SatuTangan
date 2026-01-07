import express from "express";
import {
  sendContactMessage,
  getAllContactMessages,
  getContactMessage,
  markAsRead,
  markAsReplied,
  deleteContactMessage,
} from "../controllers/contactController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/roleMiddleware";

const router = express.Router();

// Public route
router.post("/send", sendContactMessage);

// Admin routes
router.get("/messages", authMiddleware, isAdmin, getAllContactMessages);
router.get("/messages/:id", authMiddleware, isAdmin, getContactMessage);
router.patch("/messages/:id/read", authMiddleware, isAdmin, markAsRead);
router.patch("/messages/:id/replied", authMiddleware, isAdmin, markAsReplied);
router.delete("/messages/:id", authMiddleware, isAdmin, deleteContactMessage);

export default router;
