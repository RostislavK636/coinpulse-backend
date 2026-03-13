import { UserService } from "../../../modules/users/application/services/UserService";
import { appError } from "../../../shared/errors/AppError";
export class UsersController {
    userService;
    constructor(userService = new UserService()) {
        this.userService = userService;
    }
    register = async (req, res, next) => {
        try {
            const body = (req.body ?? {});
            const telegramIdRaw = body.telegram_id ?? body.telegramId;
            const hasValidTelegramId = typeof telegramIdRaw === "string" || typeof telegramIdRaw === "number";
            if (!hasValidTelegramId) {
                throw appError.validation("telegram_id is required", [
                    { field: "telegram_id", reason: "must be string or number" },
                ]);
            }
            const telegramIdString = String(telegramIdRaw).trim();
            if (telegramIdString.length === 0) {
                throw appError.validation("telegram_id is required", [
                    { field: "telegram_id", reason: "must be non-empty" },
                ]);
            }
            let telegramId;
            try {
                telegramId = BigInt(telegramIdString);
            }
            catch {
                throw appError.validation("telegram_id is invalid", [
                    { field: "telegram_id", reason: "must be integer-like" },
                ]);
            }
            if (body.username !== undefined && typeof body.username !== "string") {
                throw appError.validation("username must be string", [
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
