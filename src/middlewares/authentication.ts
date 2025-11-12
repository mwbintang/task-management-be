import { NextFunction, Request, Response } from "express";
import * as JwtHelper from "../helpers/jwt.helper";
import { User } from "../models";
import { AppError } from "../helpers/errors.helper";
import { excludedPaths } from "../constants/path";

export const authenticate =
  (roles: string[] = []) =>
  async (req: any, res: Response, next: NextFunction) => {
    try {
      // Skip authentication if the request matches any excluded path
      if (excludedPaths.some(path => req.originalUrl.includes(path))) {
        return next();
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("No token provided", 401);
      }

      const token = authHeader.split(" ")[1];
      const decoded = JwtHelper.verifyToken(token);

      if (!decoded || typeof decoded === "string" || !decoded.userId) {
        throw new AppError("Invalid token", 401);
      }

      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        throw new AppError("User not found", 401);
      }

      if (roles.length && !roles.includes(user.role)) {
        throw new AppError(
          "You don't have permission to access this resource.",
          403
        );
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Auth error:", error);
      next(error);
    }
  };
