import { Router } from 'express';
import { getEdifices, getEdifice, createEdifice, updateEdifice, deleteEdifice } from '../Controllers/Edifice.controller.js';
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/edifice', authenticateToken, getEdifices)

router.get('/edifice/:id', authenticateToken, getEdifice)

router.post('/edifice', authenticateToken, authenticateAdmin, createEdifice)

router.patch('/edifice/:id', authenticateToken, authenticateAdmin, updateEdifice)

router.delete('/edifice/:id', authenticateToken, authenticateAdmin, deleteEdifice)

export default router