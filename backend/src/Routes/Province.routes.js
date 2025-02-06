import { Router } from 'express';
import { getProvinces, getProvince, createProvince, updateProvince, deleteProvince } from '../Controllers/Province.controller.js';
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/province', authenticateToken, getProvinces)

router.get('/province/:id', authenticateToken, getProvince)

router.post('/province', authenticateToken, authenticateAdmin, createProvince)

router.patch('/province/:id', authenticateToken, authenticateAdmin, updateProvince)

router.delete('/province/:id', authenticateToken, authenticateAdmin, deleteProvince)

export default router