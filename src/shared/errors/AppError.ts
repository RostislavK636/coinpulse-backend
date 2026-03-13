export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "ANTI_CHEAT_BLOCK"
  | "INSUFFICIENT_FUNDS"
  | "WITHDRAWAL_LIMIT"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly status: number;
  public readonly code: ErrorCode;
  public readonly details?: Array<{ field?: string; reason: string }>;

  constructor(
    status: number,
    code: ErrorCode,
    message: string,
    details?: Array<{ field?: string; reason: string }>,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const appError = {
  validation: (
    message = "Validation failed",
    details?: Array<{ field?: string; reason: string }>,
  ) => new AppError(400, "VALIDATION_ERROR", message, details),
  unauthorized: (message = "Unauthorized") =>
    new AppError(401, "UNAUTHORIZED", message),
  notFound: (message = "Not found") => new AppError(404, "NOT_FOUND", message),
  rateLimited: (message = "Too many requests") =>
    new AppError(429, "RATE_LIMITED", message),
  antiCheat: (message = "Suspicious activity detected") =>
    new AppError(422, "ANTI_CHEAT_BLOCK", message),
  insufficientFunds: (message = "Insufficient funds") =>
    new AppError(422, "INSUFFICIENT_FUNDS", message),
  withdrawalLimit: (message = "Withdrawal limit exceeded") =>
    new AppError(422, "WITHDRAWAL_LIMIT", message),
  internal: (message = "Internal error") =>
    new AppError(500, "INTERNAL_ERROR", message),
};
