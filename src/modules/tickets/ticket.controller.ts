import { Request, Response } from "express";
import { handleError } from "../../helpers/errors.helper";
import { TicketService } from "./ticket.service";

export class TicketController {
    static async fetchAll(req: Request, res: Response){
        try {
            const result = await TicketService.fetchAll(req.query);

            res.json({ success: true, data: result });
        } catch (error) {
            handleError(res, error);
        }
    }

    static async updateStatus(req: Request, res: Response){
        try {
            const result = await TicketService.updateStatus(req.params.id, req.body.status, req.user?._id);

            res.json({ success: true, data: result });
        } catch (error) {
            handleError(res, error);
        }
    }
}