import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

// Public routes
router.post('/login', UserController.login);

export default router; 