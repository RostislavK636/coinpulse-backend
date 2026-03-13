import type { NextFunction, Request, Response } from "express";
import { appError } from "../../../shared/errors/AppError";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const raw = req.header("authorization");
  if (!raw?.startsWith("Bearer ")) {
    return next(appError.unauthorized());
  }

  const token = raw.replace("Bearer ", "").trim();
  if (token !== "valid-access-token") {
    return next(appError.unauthorized());
  }

  req.authUserId = "user-1";
  next();
}
