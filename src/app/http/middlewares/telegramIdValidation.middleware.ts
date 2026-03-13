import type { NextFunction, Request, Response } from "express";

function parseTelegramId(raw: unknown) {
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    return null;
  }
  return value;
}

function fail(res: Response) {
  return res.status(400).json({
    success: false,
    error: "Invalid telegram_id",
  });
}

export function validateTelegramIdFromBody(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body?.telegram_id === undefined) {
    return fail(res);
  }

  const value = parseTelegramId(req.body.telegram_id);
  if (value === null) {
    return fail(res);
  }

  (req as Request & { telegramId?: bigint }).telegramId = BigInt(value);
  return next();
}

export function validateTelegramIdFromQuery(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.query.telegram_id === undefined) {
    return fail(res);
  }

  const value = parseTelegramId(req.query.telegram_id);
  if (value === null) {
    return fail(res);
  }

  (req as Request & { telegramId?: bigint }).telegramId = BigInt(value);
  return next();
}
