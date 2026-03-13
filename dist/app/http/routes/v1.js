import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { GameController } from "../controllers/GameController";
import { LeaderboardController } from "../controllers/LeaderboardController";
import { TasksController } from "../controllers/TasksController";
import { WalletController } from "../controllers/WalletController";
import { UserController } from "../controllers/UserController";
import { tapRateLimitMiddleware } from "../middlewares/tapRateLimit.middleware";
import { validateTelegramIdFromBody, validateTelegramIdFromQuery, } from "../middlewares/telegramIdValidation.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { appError } from "../../../shared/errors/AppError";
import { createRateLimiter } from "../middlewares/rateLimit.middleware";
import { requireIdempotencyKey, validate, } from "../middlewares/validation.middleware";
const authController = new AuthController();
const gameController = new GameController();
const tasksController = new TasksController();
const walletController = new WalletController();
const userController = new UserController();
const leaderboardController = new LeaderboardController();
const authRateLimiter = createRateLimiter(10, 60_000);
function validateAuthTelegramBody(body) {
    const payload = body;
    if (typeof payload?.initData !== "string" || payload.initData.length === 0) {
        throw appError.validation("initData is required", [
            { field: "initData", reason: "must be non-empty string" },
        ]);
    }
    if (typeof payload?.device?.platform !== "string") {
        throw appError.validation("device.platform is required", [
            { field: "device.platform", reason: "must be string" },
        ]);
    }
}
function validateTapBody(body) {
    const payload = body;
    if (typeof payload?.taps !== "number" ||
        !Number.isFinite(payload.taps) ||
        payload.taps <= 0) {
        throw appError.validation("Invalid taps", [
            { field: "taps", reason: "must be positive number" },
        ]);
    }
    if (typeof payload?.clientTs !== "number") {
        throw appError.validation("Invalid clientTs", [
            { field: "clientTs", reason: "must be number" },
        ]);
    }
    if (typeof payload?.nonce !== "string" || payload.nonce.length === 0) {
        throw appError.validation("Invalid nonce", [
            { field: "nonce", reason: "must be string" },
        ]);
    }
}
function validateWithdrawBody(body) {
    const payload = body;
    if (typeof payload?.amount !== "number" || payload.amount <= 0) {
        throw appError.validation("Invalid amount", [
            { field: "amount", reason: "must be positive number" },
        ]);
    }
    if (payload?.network !== "TON" && payload?.network !== "EVM") {
        throw appError.validation("Invalid network", [
            { field: "network", reason: "must be TON or EVM" },
        ]);
    }
    if (typeof payload?.address !== "string") {
        throw appError.validation("Invalid address", [
            { field: "address", reason: "must be string" },
        ]);
    }
}
export function createV1Router() {
    const router = Router();
    router.post("/auth/telegram", authRateLimiter, validate({ body: validateAuthTelegramBody }), authController.telegramLogin);
    router.post("/auth/refresh", authController.refresh);
    router.get("/me", validateTelegramIdFromQuery, userController.me);
    router.post("/tap", validateTelegramIdFromBody, tapRateLimitMiddleware, userController.tap);
    router.post("/daily", validateTelegramIdFromBody, userController.daily);
    router.get("/leaderboard", leaderboardController.list);
    router.get("/game/state", authMiddleware, gameController.getState);
    router.post("/game/tap", authMiddleware, validate({ headers: requireIdempotencyKey, body: validateTapBody }), gameController.tap);
    router.get("/tasks", authMiddleware, tasksController.list);
    router.post("/tasks/:taskId/claim", authMiddleware, validate({ headers: requireIdempotencyKey }), tasksController.claim);
    router.post("/wallet/withdraw", authMiddleware, validate({ headers: requireIdempotencyKey, body: validateWithdrawBody }), walletController.withdraw);
    router.get("/test/trigger-unhandled-error", authMiddleware, () => {
        throw new Error("boom");
    });
    return router;
}
