import { TelegramAuthService } from "../../../modules/auth/application/services/TelegramAuthService";
import { appError } from "../../../shared/errors/AppError";
export class AuthController {
    authService;
    constructor(authService = new TelegramAuthService({
        botToken: "test",
        maxAuthAgeSeconds: 60,
    })) {
        this.authService = authService;
    }
    telegramLogin = async (req, res, next) => {
        try {
            const result = await this.authService.authenticate({
                initData: req.body.initData,
                ip: req.ip ?? "unknown",
                userAgent: req.header("user-agent") ?? "unknown",
            });
            res.status(200).json({
                success: true,
                data: {
                    user: result.user,
                    tokens: result.tokens,
                    isNewUser: result.isNewUser,
                },
                meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
            });
        }
        catch (error) {
            next(error);
        }
    };
    refresh = async (req, res, next) => {
        try {
            const refreshToken = req.body?.refreshToken;
            if (typeof refreshToken !== "string" || refreshToken.length < 5) {
                throw appError.validation("Invalid refresh token");
            }
            res.status(200).json({
                success: true,
                data: {
                    tokens: {
                        accessToken: `access-rotated-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                        refreshToken: `refresh-rotated-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                        expiresInSec: 3600,
                    },
                },
                meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
