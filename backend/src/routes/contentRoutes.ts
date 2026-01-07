import { Router } from 'express';
import { getContent, updateContent } from '../controllers/contentController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

// Public route to get content
router.get('/:key', getContent);

// Admin route to update content
router.put('/:key', authMiddleware, roleMiddleware(['ADMIN']), updateContent);

export default router;
