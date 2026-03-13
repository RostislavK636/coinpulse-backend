import type { NextFunction, Request, Response } from "express";
import { appError } from "../../../shared/errors/AppError";

type Bucket = {
  count: number;
  resetAt: number;
};

export function createRateLimiter(max: number, windowMs: number) {
  const buckets = new Map<string, Bucket>();

  return (req: Request, _res: Response, next: NextFunction) => {
    const key = req.ip || "unknown";
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || existing.resetAt < now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    existing.count += 1;
    if (existing.count > max) {
      return next(appError.rateLimited());
    }

    return next();
  };
}
