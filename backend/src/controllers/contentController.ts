import { Request, Response } from 'express';
import { DatabaseService } from '../services/databaseService';
import { RowDataPacket } from 'mysql2';

const db = new DatabaseService();

interface StaticContent extends RowDataPacket {
  id: string;
  content_key: string;
  content: string;
  updated_at: Date;
}

export const getContent = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    const [content] = await db.query<StaticContent>(
      'SELECT * FROM static_content WHERE content_key = ?',
      [key]
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CONTENT_001',
          message: 'Content not found',
        },
      });
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Failed to fetch content',
      },
    });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_002',
          message: 'Content is required',
        },
      });
    }

    // Check if content exists
    const [existing] = await db.query<StaticContent>(
      'SELECT * FROM static_content WHERE content_key = ?',
      [key]
    );

    if (existing) {
      // Update existing content
      await db.execute(
        'UPDATE static_content SET content = ?, updated_at = NOW() WHERE content_key = ?',
        [content, key]
      );
    } else {
      // Insert new content
      await db.execute(
        'INSERT INTO static_content (content_key, content) VALUES (?, ?)',
        [key, content]
      );
    }

    const [updated] = await db.query<StaticContent>(
      'SELECT * FROM static_content WHERE content_key = ?',
      [key]
    );

    res.json({
      success: true,
      data: updated,
      message: 'Content updated successfully',
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Failed to update content',
      },
    });
  }
};
