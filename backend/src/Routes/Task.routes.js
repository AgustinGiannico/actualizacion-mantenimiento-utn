import { Router } from 'express';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../Controllers/Task.controller.js';
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/task', authenticateToken, getTasks)

router.get('/task/:id', authenticateToken, getTask)

router.post('/task', authenticateToken, authenticateAdmin, createTask)

router.patch('/task/:id', authenticateToken, authenticateAdmin, updateTask)

router.delete('/task/:id', authenticateToken, authenticateAdmin, deleteTask)

export default router