import { Router } from 'express';
import { getTaskTypes, getTaskType, createTaskType, updateTaskType, deleteTaskType } from '../Controllers/Task_type.controller.js';
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/task-type', authenticateToken, getTaskTypes)

router.get('/task-type/:id', authenticateToken, getTaskType)

router.post('/task-type', authenticateToken, authenticateAdmin, createTaskType)

router.patch('/task-type/:id', authenticateToken, authenticateAdmin, updateTaskType)

router.delete('/task-type/:id', authenticateToken, authenticateAdmin, deleteTaskType)

export default router