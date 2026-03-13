import { Prisma } from "@prisma/client";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
export class UserService {
    repository;
    constructor(repository = new UserRepository()) {
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
            if (error instanceof Prisma.PrismaClientKnownRequestError &&
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
