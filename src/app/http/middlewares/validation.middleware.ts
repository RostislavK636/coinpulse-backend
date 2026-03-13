import type { NextFunction, Request, Response } from "express";
import { appError } from "../../../shared/errors/AppError";

export type ValidationRule = {
  body?: (body: unknown, req: Request) => void;
  headers?: (req: Request) => void;
};

export function validate(rule: ValidationRule) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      rule.headers?.(req);
      rule.body?.(req.body, req);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireIdempotencyKey(req: Request) {
  if (!req.header("Idempotency-Key")) {
    throw appError.validation("Idempotency-Key is required", [
      { field: "Idempotency-Key", reason: "header missing" },
    ]);
  }
}
