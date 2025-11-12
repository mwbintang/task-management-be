import { Router } from 'express';
import userRoute from "./modules/users/user.routes";
import ticketRoute from "./modules/tickets/ticket.routes";
import projectRoute from "./modules/projects/project.routes";
import { authenticate } from './middlewares/authentication';

const router = Router();

router.use(authenticate())
router.use('/user', userRoute);
router.use('/ticket', ticketRoute);
router.use('/project', projectRoute);

export default router; 