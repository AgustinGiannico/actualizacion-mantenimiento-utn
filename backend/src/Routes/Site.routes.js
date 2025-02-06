import { Router } from 'express';
import { getSites, getSite, createSite, updateSite, deleteSite } from '../Controllers/Site.controller.js';
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/site', authenticateToken, getSites)

router.get('/site/:id', authenticateToken, getSite)

router.post('/site', authenticateToken, authenticateAdmin, createSite)

router.patch('/site/:id', authenticateToken, authenticateAdmin, updateSite)

router.delete('/site/:id', authenticateToken, authenticateAdmin, deleteSite)

export default router