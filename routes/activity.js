import express from 'express';
import { getActivityLogs, getUserActivityLogs } from '../controllers/activityController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, getActivityLogs);
router.get('/user', verifyToken, getUserActivityLogs);

export default router;
