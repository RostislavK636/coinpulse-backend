"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tapRateLimitMiddleware = tapRateLimitMiddleware;
const AppError_1 = require("../../../shared/errors/AppError");
const tapTimestampsByTelegramId = new Map();
function tapRateLimitMiddleware(req, _res, next) {
    const telegramIdRaw = req.body?.telegram_id;
    if (telegramIdRaw === undefined || telegramIdRaw === null) {
        next();
        return;
    }
    const telegramId = String(telegramIdRaw);
    const now = Date.now();
    const oneSecondAgo = now - 1000;
    const current = tapTimestampsByTelegramId.get(telegramId) ?? [];
    const recent = current.filter((timestamp) => timestamp > oneSecondAgo);
    recent.push(now);
    tapTimestampsByTelegramId.set(telegramId, recent);
    if (recent.length > 10) {
        next(AppError_1.appError.rateLimited("Too many taps"));
        return;
    }
    next();
}
