"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const UserService_1 = require("../../../modules/users/application/services/UserService");
const AppError_1 = require("../../../shared/errors/AppError");
class UsersController {
    userService;
    constructor(userService = new UserService_1.UserService()) {
        this.userService = userService;
    }
    register = async (req, res, next) => {
        try {
            const body = (req.body ?? {});
            const telegramIdRaw = body.telegram_id ?? body.telegramId;
            const hasValidTelegramId = typeof telegramIdRaw === "string" || typeof telegramIdRaw === "number";
            if (!hasValidTelegramId) {
                throw AppError_1.appError.validation("telegram_id is required", [
                    { field: "telegram_id", reason: "must be string or number" },
                ]);
            }
            const telegramIdString = String(telegramIdRaw).trim();
            if (telegramIdString.length === 0) {
                throw AppError_1.appError.validation("telegram_id is required", [
                    { field: "telegram_id", reason: "must be non-empty" },
                ]);
            }
            let telegramId;
            try {
                telegramId = BigInt(telegramIdString);
            }
            catch {
                throw AppError_1.appError.validation("telegram_id is invalid", [
                    { field: "telegram_id", reason: "must be integer-like" },
                ]);
            }
            if (body.username !== undefined && typeof body.username !== "string") {
                throw AppError_1.appError.validation("username must be string", [
                    { field: "username", reason: "must be string when provided" },
                ]);
            }
            // Telegram-only onboarding removes email/password friction and reduces drop-off.
            const user = await this.userService.registerByTelegramId({
                telegramId,
                username: body.username,
            });
            // Keep response shape explicit and stable for bot/frontend consumers.
            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        telegram_id: Number(user.telegram_id),
                        username: user.username,
                        created_at: user.createdAt.toISOString(),
                    },
                },
                meta: {
                    requestId: req.requestId,
                    timestamp: new Date().toISOString(),
                },
            });
        }
        catch (error) {
            // Centralized middleware returns consistent JSON error payloads.
            next(error);
        }
    };
}
exports.UsersController = UsersController;
