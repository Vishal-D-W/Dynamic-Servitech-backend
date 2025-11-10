import express from 'express';
import { calculatePassword, getPasswordHistory } from '../controllers/calculatorController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/calculate', verifyToken, calculatePassword);
router.get('/history', verifyToken, getPasswordHistory);

export default router;
