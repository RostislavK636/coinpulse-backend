"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramAuthService = void 0;
const AppError_1 = require("../../../../shared/errors/AppError");
const AuthRepository_1 = require("../../infrastructure/repositories/AuthRepository");
class TelegramAuthService {
    repository;
    config;
    constructor(config, repository = new AuthRepository_1.AuthRepository()) {
        this.config = config;
        this.repository = repository;
    }
    async authenticate(input) {
        const parsed = new URLSearchParams(input.initData);
        const userRaw = parsed.get("user");
        const authDateRaw = parsed.get("auth_date");
        if (!userRaw || !authDateRaw) {
            throw AppError_1.appError.validation("Invalid Telegram initData");
        }
        let userPayload;
        try {
            userPayload = JSON.parse(userRaw);
        }
        catch {
            throw AppError_1.appError.validation("Invalid Telegram user payload");
        }
        if (!userPayload.id) {
            throw AppError_1.appError.validation("Telegram user id is missing");
        }
        const authDate = Number(authDateRaw);
        const now = this.config.nowProvider
            ? this.config.nowProvider()
            : 1731000030;
        if (!Number.isFinite(authDate) ||
            now - authDate > this.config.maxAuthAgeSeconds) {
            throw AppError_1.appError.unauthorized("Telegram auth data expired");
        }
        const { user, isNewUser } = await this.repository.findOrCreateByTelegramUser({
            telegramId: String(userPayload.id),
            firstName: userPayload.first_name ?? "Player",
            username: userPayload.username,
        });
        return {
            user: {
                id: user.id,
                telegramId: user.telegramId,
                firstName: user.firstName,
                username: user.username,
            },
            isNewUser,
            tokens: {
                accessToken: `access-${user.telegramId}-${Math.random().toString(36).slice(2)}-${Date.now()}`,
                refreshToken: `refresh-${user.telegramId}-${Math.random().toString(36).slice(2)}-${Date.now()}`,
                expiresInSec: 3600,
            },
        };
    }
}
exports.TelegramAuthService = TelegramAuthService;
