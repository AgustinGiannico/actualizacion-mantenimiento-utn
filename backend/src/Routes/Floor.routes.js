import { Router } from 'express';
import { getFloors, getFloor, createFloor, updateFloor, deleteFloor } from '../Controllers/Floor.controller.js';
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/floor', authenticateToken, getFloors)

router.get('/floor/:id', authenticateToken, getFloor)

router.post('/floor', authenticateToken, authenticateAdmin, createFloor)

router.patch('/floor/:id', authenticateToken, authenticateAdmin, updateFloor)

router.delete('/floor/:id', authenticateToken, authenticateAdmin, deleteFloor)

export default router