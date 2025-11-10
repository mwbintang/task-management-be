import { Router } from 'express';
import userRoute from "./modules/users/user.routes";
import ticketRoute from "./modules/tickets/ticket.routes";

const router = Router();

router.use('/', userRoute);
router.use('/ticket', ticketRoute);

export default router; 