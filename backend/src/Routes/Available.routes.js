import { Router } from 'express';
import { getAvailables, getAvailable } from '../Controllers/Available.controller.js';
import { authenticateToken } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/available', authenticateToken, getAvailables)

router.get('/available/:id', authenticateToken, getAvailable)

export default router