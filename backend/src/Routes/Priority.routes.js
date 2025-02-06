import { Router } from 'express';
import { getPriorities, getPriority, createPriority, updatePriority, deletePriority } from '../Controllers/Priority.controller.js';
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/priority', authenticateToken, getPriorities)

router.get('/priority/:id', authenticateToken, getPriority)

router.post('/priority', authenticateToken, authenticateAdmin, createPriority)

router.patch('/priority/:id', authenticateToken, authenticateAdmin, updatePriority)

router.delete('/priority/:id', authenticateToken, authenticateAdmin, deletePriority)

export default router