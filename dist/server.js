"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const createApp_1 = require("./app/bootstrap/createApp");
const client_1 = require("./prisma/client");
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        await client_1.prisma.$connect();
        console.log("Prisma connected successfully");
    }
    catch (error) {
        console.error("Failed to connect to database on startup", error);
        process.exit(1);
    }
    const app = (0, createApp_1.createApp)();
    const server = app.listen(PORT, () => {
        console.log(`CoinPulse backend started on port ${PORT}`);
    });
    let shuttingDown = false;
    const shutdown = async (signal) => {
        if (shuttingDown) {
            return;
        }
        shuttingDown = true;
        console.log(`Received ${signal}, shutting down gracefully...`);
        await new Promise((resolve) => {
            server.close(() => resolve());
        });
        await client_1.prisma.$disconnect();
        console.log("Shutdown complete");
        process.exit(0);
    };
    process.on("SIGINT", () => {
        void shutdown("SIGINT");
    });
    process.on("SIGTERM", () => {
        void shutdown("SIGTERM");
    });
}
void startServer();
