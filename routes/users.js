import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  activateUser,
  deactivateUser,
  deleteUser,
} from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, isAdmin, createUser);
router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/:id', verifyToken, isAdmin, getUserById);
router.patch('/:id/activate', verifyToken, isAdmin, activateUser);
router.patch('/:id/deactivate', verifyToken, isAdmin, deactivateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;
