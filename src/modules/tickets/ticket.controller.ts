import { Request, Response } from "express";
import { handleError } from "../../helpers/errors.helper";
import { TicketService } from "./ticket.service";

export class TicketController {
    static async fetchAll(req: Request, res: Response) {
        try {
            const result = await TicketService.fetchAll(req.query, req.user?._id);

            res.json({ success: true, data: result });
        } catch (error) {
            handleError(res, error);
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const result = await TicketService.updateStatus(req.params.id, req.body.status, req.user?._id);

            res.json({ success: true, data: result });
        } catch (error) {
            handleError(res, error);
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const files = req.files as Express.Multer.File[] | undefined;

            const attachments = files?.map(file => ({
                filename: file.originalname,
                url: `/uploads/${file.filename}`, // or your public URL
                mimetype: file.mimetype,
                size: file.size,
            })) || [];

            const ticketData = {
                ...req.body,
                reporter: req.user?._id,
                attachments,
            };
            const result = await TicketService.create(ticketData);

            res.json({ success: true, data: result });
        } catch (error) {
            handleError(res, error);
        }
    }
}