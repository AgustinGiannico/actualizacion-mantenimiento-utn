import { Router } from 'express';
import { getOtStates, getOtState } from '../Controllers/Ot_state.controller.js';
import { authenticateToken } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/ot-state', authenticateToken, getOtStates)

router.get('/ot-state/:id', authenticateToken, getOtState)

export default router