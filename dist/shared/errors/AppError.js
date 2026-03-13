"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appError = exports.AppError = void 0;
class AppError extends Error {
    status;
    code;
    details;
    constructor(status, code, message, details) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}
exports.AppError = AppError;
exports.appError = {
    validation: (message = "Validation failed", details) => new AppError(400, "VALIDATION_ERROR", message, details),
    unauthorized: (message = "Unauthorized") => new AppError(401, "UNAUTHORIZED", message),
    notFound: (message = "Not found") => new AppError(404, "NOT_FOUND", message),
    rateLimited: (message = "Too many requests") => new AppError(429, "RATE_LIMITED", message),
    antiCheat: (message = "Suspicious activity detected") => new AppError(422, "ANTI_CHEAT_BLOCK", message),
    insufficientFunds: (message = "Insufficient funds") => new AppError(422, "INSUFFICIENT_FUNDS", message),
    withdrawalLimit: (message = "Withdrawal limit exceeded") => new AppError(422, "WITHDRAWAL_LIMIT", message),
    internal: (message = "Internal error") => new AppError(500, "INTERNAL_ERROR", message),
};
