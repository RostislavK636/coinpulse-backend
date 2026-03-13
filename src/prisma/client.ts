import "dotenv/config";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __coinpulse_prisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__coinpulse_prisma__ ??
  new PrismaClient({
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__coinpulse_prisma__ = prisma;
}
