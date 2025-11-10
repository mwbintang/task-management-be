import { Router } from 'express';
import { TicketController } from './ticket.controller';
import { authenticate } from '../../middlewares/authentication';

const router = Router();

router.use(authenticate())
router.get('/', TicketController.fetchAll);
router.put('/:id/status', TicketController.updateStatus);

export default router; 