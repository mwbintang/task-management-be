import { Request, Response } from "express";
import { handleError } from "../../helpers/errors.helper";
import { UserService } from "./user.service";

export class UserController {
    static async login(req: Request, res: Response){
        try {
            const { email, password } = req.body;
            const result = await UserService.login(email, password);

            res.json({ success: true, data: result });
        } catch (error) {
            handleError(res, error);
        }
    }
}