import { Router } from 'express';
import { registerUser } from '../Controllers/Register.controller.js';
import { loginUser } from '../Controllers/Login.controller.js';
import { authenticateToken, authenticateAdmin } from '../middlewares/auth.Middleware.js';

const router = Router();

router.post('/register', authenticateToken, authenticateAdmin, registerUser);

router.post('/login', loginUser);

export default router