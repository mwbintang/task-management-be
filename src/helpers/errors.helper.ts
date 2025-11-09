import { Response } from "express";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Only keep stack trace for dev
    if (process.env.NODE_ENV === "production") {
      this.stack = undefined;
    }
  }
}

export const handleError = (res: Response, error: any) => {
  const status = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  return res.status(status).json({
    success: false,
    message,
  });
};