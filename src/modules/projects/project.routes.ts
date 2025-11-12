import { Router } from 'express';
import { ProjectController } from './project.controller';

const router = Router();

router.get('/', ProjectController.getAll);
router.post('/', ProjectController.create);

export default router; 