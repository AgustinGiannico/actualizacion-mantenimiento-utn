import { Router } from "express";
import { getOts, getOt, createOt, updateOt, deleteOt } from "../Controllers/Ot.controller.js";
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/ot', authenticateToken, getOts)

router.get('/ot/:id', authenticateToken, getOt)

router.post('/ot', authenticateToken, authenticateAdmin, createOt)

router.patch('/ot/:id', authenticateToken, updateOt)

router.delete('/ot/:id', authenticateToken, authenticateAdmin, deleteOt)

export default router