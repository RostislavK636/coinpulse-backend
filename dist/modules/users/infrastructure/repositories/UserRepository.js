import { prisma } from "../../../../infrastructure/prisma/client";
export class UserRepository {
    async findByTelegramId(telegramId) {
        return prisma.user.findUnique({ where: { telegram_id: telegramId } });
    }
    async createByTelegramId(telegramId, username) {
        return prisma.user.create({
            data: {
                telegram_id: telegramId,
                username,
            },
        });
    }
    async updateBalanceAndEnergy(input) {
        return prisma.user.update({
            where: { id: input.id },
            data: {
                balance: input.balance,
                energy: input.energy,
            },
        });
    }
    async updateEnergyState(input) {
        return prisma.user.update({
            where: { id: input.id },
            data: {
                energy: input.energy,
                lastEnergyUpdate: input.lastEnergyUpdate,
            },
        });
    }
    async applyDailyReward(input) {
        return prisma.user.update({
            where: { id: input.id },
            data: {
                balance: input.balance,
                lastDailyReward: input.lastDailyReward,
            },
        });
    }
    async getLeaderboard(limit = 20) {
        return prisma.user.findMany({
            take: limit,
            orderBy: { balance: "desc" },
            select: {
                username: true,
                balance: true,
            },
        });
    }
    async createOrGetTestUser() {
        return prisma.user.upsert({
            where: { telegram_id: BigInt(999000111) },
            update: { username: "test_user" },
            create: {
                telegram_id: BigInt(999000111),
                username: "test_user",
            },
        });
    }
    async findAll() {
        return prisma.user.findMany({ orderBy: { createdAt: "asc" } });
    }
}
