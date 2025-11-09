import { Router } from 'express';
import userRoute from "./modules/users/user.routes";

const router = Router();

router.use('/', userRoute);

export default router; 