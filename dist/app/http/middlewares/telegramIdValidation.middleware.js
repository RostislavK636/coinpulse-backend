function parseTelegramId(raw) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0) {
        return null;
    }
    return value;
}
function fail(res) {
    return res.status(400).json({
        success: false,
        error: "Invalid telegram_id",
    });
}
export function validateTelegramIdFromBody(req, res, next) {
    if (req.body?.telegram_id === undefined) {
        return fail(res);
    }
    const value = parseTelegramId(req.body.telegram_id);
    if (value === null) {
        return fail(res);
    }
    req.telegramId = BigInt(value);
    return next();
}
export function validateTelegramIdFromQuery(req, res, next) {
    if (req.query.telegram_id === undefined) {
        return fail(res);
    }
    const value = parseTelegramId(req.query.telegram_id);
    if (value === null) {
        return fail(res);
    }
    req.telegramId = BigInt(value);
    return next();
}
