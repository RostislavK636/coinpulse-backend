import "dotenv/config";
import { PrismaClient } from "@prisma/client";
export const prisma = globalThis.__coinpulse_prisma__ ??
    new PrismaClient({
        log: ["warn", "error"],
    });
if (process.env.NODE_ENV !== "production") {
    globalThis.__coinpulse_prisma__ = prisma;
}
