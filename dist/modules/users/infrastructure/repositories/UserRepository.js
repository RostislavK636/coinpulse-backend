"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("../../../../infrastructure/prisma/client");
class UserRepository {
    async findByTelegramId(telegramId) {
        return client_1.prisma.user.findUnique({ where: { telegram_id: telegramId } });
    }
    async createByTelegramId(telegramId, username) {
        return client_1.prisma.user.create({
            data: {
                telegram_id: telegramId,
                username,
            },
        });
    }
    async updateBalanceAndEnergy(input) {
        return client_1.prisma.user.update({
            where: { id: input.id },
            data: {
                balance: input.balance,
                energy: input.energy,
            },
        });
    }
    async updateEnergyState(input) {
        return client_1.prisma.user.update({
            where: { id: input.id },
            data: {
                energy: input.energy,
                lastEnergyUpdate: input.lastEnergyUpdate,
            },
        });
    }
    async applyDailyReward(input) {
        return client_1.prisma.user.update({
            where: { id: input.id },
            data: {
                balance: input.balance,
                lastDailyReward: input.lastDailyReward,
            },
        });
    }
    async getLeaderboard(limit = 20) {
        return client_1.prisma.user.findMany({
            take: limit,
            orderBy: { balance: "desc" },
            select: {
                username: true,
                balance: true,
            },
        });
    }
    async createOrGetTestUser() {
        return client_1.prisma.user.upsert({
            where: { telegram_id: BigInt(999000111) },
            update: { username: "test_user" },
            create: {
                telegram_id: BigInt(999000111),
                username: "test_user",
            },
        });
    }
    async findAll() {
        return client_1.prisma.user.findMany({ orderBy: { createdAt: "asc" } });
    }
}
exports.UserRepository = UserRepository;
