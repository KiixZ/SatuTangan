import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import databaseService from "../services/databaseService";
import { logger } from "../utils/logger";

/**
 * Send contact message
 */
export const sendContactMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_001",
          message: "All fields are required",
        },
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_002",
          message: "Invalid email format",
        },
      });
      return;
    }

    const messageId = uuidv4();

    await databaseService.execute(
      `INSERT INTO contact_messages (id, name, email, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [messageId, name, email, subject, message],
    );

    logger.info(`Contact message received from ${email}`);

    res.status(201).json({
      success: true,
      data: {
        message: "Your message has been sent successfully",
        id: messageId,
      },
    });
  } catch (error) {
    logger.error("Error sending contact message", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Failed to send message",
      },
    });
  }
};

/**
 * Get all contact messages (Admin only)
 */
export const getAllContactMessages = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { page = 1, limit = 20, is_read, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = "";
    const params: any[] = [];

    if (is_read !== undefined) {
      whereClause = "WHERE is_read = ?";
      params.push(is_read === "true");
    }

    if (search) {
      whereClause += whereClause ? " AND" : "WHERE";
      whereClause += " (name LIKE ? OR email LIKE ? OR subject LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const [messages, [{ total }]] = await Promise.all([
      databaseService.query(
        `SELECT id, name, email, subject, message, is_read, is_replied, created_at
         FROM contact_messages
         ${whereClause}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, Number(limit), offset],
      ),
      databaseService.query(
        `SELECT COUNT(*) as total FROM contact_messages ${whereClause}`,
        params,
      ),
    ]);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    logger.error("Error fetching contact messages", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Failed to fetch messages",
      },
    });
  }
};

/**
 * Get single contact message (Admin only)
 */
export const getContactMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const [messages]: any = await databaseService.query(
      `SELECT * FROM contact_messages WHERE id = ?`,
      [id],
    );

    if (messages.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND_001",
          message: "Message not found",
        },
      });
      return;
    }

    res.json({
      success: true,
      data: messages[0],
    });
  } catch (error) {
    logger.error("Error fetching contact message", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Failed to fetch message",
      },
    });
  }
};

/**
 * Mark message as read (Admin only)
 */
export const markAsRead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    await databaseService.execute(
      `UPDATE contact_messages SET is_read = TRUE WHERE id = ?`,
      [id],
    );

    res.json({
      success: true,
      data: {
        message: "Message marked as read",
      },
    });
  } catch (error) {
    logger.error("Error marking message as read", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Failed to update message",
      },
    });
  }
};

/**
 * Mark message as replied (Admin only)
 */
export const markAsReplied = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    await databaseService.execute(
      `UPDATE contact_messages SET is_replied = TRUE WHERE id = ?`,
      [id],
    );

    res.json({
      success: true,
      data: {
        message: "Message marked as replied",
      },
    });
  } catch (error) {
    logger.error("Error marking message as replied", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Failed to update message",
      },
    });
  }
};

/**
 * Delete contact message (Admin only)
 */
export const deleteContactMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    await databaseService.execute(`DELETE FROM contact_messages WHERE id = ?`, [
      id,
    ]);

    res.json({
      success: true,
      data: {
        message: "Message deleted successfully",
      },
    });
  } catch (error) {
    logger.error("Error deleting contact message", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_001",
        message: "Failed to delete message",
      },
    });
  }
};
