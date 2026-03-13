"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const users = new Map();
class AuthRepository {
    async findOrCreateByTelegramUser(input) {
        const existing = users.get(input.telegramId);
        if (existing) {
            return { user: existing, isNewUser: false };
        }
        const created = {
            id: `user-${input.telegramId}`,
            telegramId: input.telegramId,
            firstName: input.firstName,
            username: input.username,
        };
        users.set(input.telegramId, created);
        return { user: created, isNewUser: true };
    }
}
exports.AuthRepository = AuthRepository;
