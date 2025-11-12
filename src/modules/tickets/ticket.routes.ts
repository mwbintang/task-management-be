import { NextFunction, Request, Response, Router } from 'express';
import { TicketController } from './ticket.controller';
import { upload } from '../../middlewares/upload.middleware';
import multer from 'multer';

const router = Router();

router.get('/', TicketController.fetchAll);
router.post(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    upload.array("files")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        // Unknown errors
        return res.status(400).json({ success: false, message: err.message });
      }
      // If no error, proceed to controller
      TicketController.create(req, res);
    });
  }
);
router.patch('/:id/status', TicketController.updateStatus);

export default router; 