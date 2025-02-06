import { Router } from 'express';
import { getAssetTypes, getAssetType, createAssetType, updateAssetType, deleteAssetType } from '../Controllers/Asset_type.controller.js';
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/asset-type', authenticateToken, getAssetTypes)

router.get('/asset-type/:id', authenticateToken, getAssetType)

router.post('/asset-type', authenticateToken, authenticateAdmin, createAssetType)

router.patch('/asset-type/:id', authenticateToken, authenticateAdmin, updateAssetType)

router.delete('/asset-type/:id', authenticateToken, authenticateAdmin, deleteAssetType)

export default router