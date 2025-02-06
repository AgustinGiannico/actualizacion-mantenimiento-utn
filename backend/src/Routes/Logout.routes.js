import { Router } from 'express';
import { closeSession } from '../Controllers/Logout.controller.js';
import { authenticateToken } from '../middlewares/auth.Middleware.js';

const router = Router()

router.post('/logout', authenticateToken, closeSession);

export default router