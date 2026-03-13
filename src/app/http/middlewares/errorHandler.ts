import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/AppError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        requestId: req.requestId,
        details: err.details,
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal Server Error",
      requestId: req.requestId,
    },
  });
}
