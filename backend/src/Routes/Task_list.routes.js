import { Router } from 'express';
import { getTaskLists, getTaskList, getFilterTaskList, createTaskList, updateTaskList, deleteTaskList } from '../Controllers/Task_list.controller.js';
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router()

router.get('/task-list', authenticateToken, getTaskLists)

router.get('/task-list/:id', authenticateToken, getTaskList)

router.post('/task-list/filter', authenticateToken, getFilterTaskList)

router.post('/task-list', authenticateToken, authenticateAdmin, createTaskList)

router.patch('/task-list/:id', authenticateToken, authenticateAdmin, updateTaskList)

router.delete('/task-list/:id', authenticateToken, authenticateAdmin, deleteTaskList)

export default router