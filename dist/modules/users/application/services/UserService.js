"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
class UserService {
    repository;
    constructor(repository = new UserRepository_1.UserRepository()) {
        this.repository = repository;
    }
    async registerByTelegramId(input) {
        // Check first to keep registration idempotent and avoid duplicate users.
        const existing = await this.repository.findByTelegramId(input.telegramId);
        if (existing) {
            return existing;
        }
        try {
            return await this.repository.createByTelegramId(input.telegramId, input.username);
        }
        catch (error) {
            // Concurrent requests can race on unique telegramId; fallback to read.
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002") {
                const user = await this.repository.findByTelegramId(input.telegramId);
                if (user) {
                    return user;
                }
            }
            throw error;
        }
    }
}
exports.UserService = UserService;
