import { Request, Response } from "express";
import { handleError } from "../../helpers/errors.helper";
import { ProjectService } from "./project.service";

export class ProjectController {
    static async getAll(req: Request, res: Response){
        try {
            const result = await ProjectService.getAll(req.user?._id);

            res.json({ success: true, data: result });
        } catch (error) {
            handleError(res, error);
        }
    }

    static async create(req: Request, res: Response){
        try {
            const result = await ProjectService.create(req.body, req.user?._id);

            res.json({ success: true, data: result });
        } catch (error) {
            handleError(res, error);
        }
    }
}