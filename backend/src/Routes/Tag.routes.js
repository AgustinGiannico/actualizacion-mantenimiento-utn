import { Router } from 'express'
import { getTags, getTag, createTag, updateTag, deleteTag } from '../Controllers/Tag.controller.js'
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/tag', authenticateToken, getTags)

router.get('/tag/:id', authenticateToken, getTag)

router.post('/tag', authenticateToken, authenticateAdmin, createTag)

router.patch('/tag/:id', authenticateToken, authenticateAdmin, updateTag)

router.delete('/tag/:id', authenticateToken, authenticateAdmin, deleteTag)

export default router