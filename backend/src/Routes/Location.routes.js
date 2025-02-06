import { Router } from 'express';
import { getLocations, getLocation } from '../Controllers/Location.controller.js';
import { authenticateToken } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/location', authenticateToken, getLocations)

router.get('/location/:id', authenticateToken, getLocation)

export default router