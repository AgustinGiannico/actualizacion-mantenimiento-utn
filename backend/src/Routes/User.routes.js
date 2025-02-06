import { Router } from 'express';
import { getUsers, getUser, updateUser, deleteUser } from '../Controllers/User.controller.js';
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/user', authenticateToken, getUsers)

router.get('/user/:id', authenticateToken, getUser)

router.patch('/user/:id', authenticateToken, authenticateAdmin, updateUser)

router.delete('/user/:id', authenticateToken, authenticateAdmin, deleteUser)

export default router