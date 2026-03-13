"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const TelegramAuthService_1 = require("../../../modules/auth/application/services/TelegramAuthService");
const AppError_1 = require("../../../shared/errors/AppError");
class AuthController {
    authService;
    constructor(authService = new TelegramAuthService_1.TelegramAuthService({
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
                throw AppError_1.appError.validation("Invalid refresh token");
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
exports.AuthController = AuthController;
