import { appError } from "../../../shared/errors/AppError";
const tapTimestampsByTelegramId = new Map();
export function tapRateLimitMiddleware(req, _res, next) {
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
        next(appError.rateLimited("Too many taps"));
        return;
    }
    next();
}
