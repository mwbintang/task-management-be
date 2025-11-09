// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../helpers/errors.helper";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If it's our custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle validation errors from Mongoose
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyErr = err as any;
  if (anyErr.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: anyErr.message,
      errors: anyErr.errors,
    });
  }

  // Default fallback
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
