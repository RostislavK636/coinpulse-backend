"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = createRateLimiter;
const AppError_1 = require("../../../shared/errors/AppError");
function createRateLimiter(max, windowMs) {
    const buckets = new Map();
    return (req, _res, next) => {
        const key = req.ip || "unknown";
        const now = Date.now();
        const existing = buckets.get(key);
        if (!existing || existing.resetAt < now) {
            buckets.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }
        existing.count += 1;
        if (existing.count > max) {
            return next(AppError_1.appError.rateLimited());
        }
        return next();
    };
}
