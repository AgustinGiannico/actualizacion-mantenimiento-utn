import { Router } from 'express';
import { getSectors, getSector, createSector, updateSector, deleteSector } from '../Controllers/Sector.controller.js';
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/sector', authenticateToken, getSectors)

router.get('/sector/:id', authenticateToken, getSector)

router.post('/sector', authenticateToken, authenticateAdmin, createSector)

router.patch('/sector/:id', authenticateToken, authenticateAdmin, updateSector)

router.delete('/sector/:id', authenticateToken, authenticateAdmin, deleteSector)

export default router