"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createV1Router = createV1Router;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const GameController_1 = require("../controllers/GameController");
const LeaderboardController_1 = require("../controllers/LeaderboardController");
const TasksController_1 = require("../controllers/TasksController");
const WalletController_1 = require("../controllers/WalletController");
const UserController_1 = require("../controllers/UserController");
const tapRateLimit_middleware_1 = require("../middlewares/tapRateLimit.middleware");
const telegramIdValidation_middleware_1 = require("../middlewares/telegramIdValidation.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const AppError_1 = require("../../../shared/errors/AppError");
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const authController = new AuthController_1.AuthController();
const gameController = new GameController_1.GameController();
const tasksController = new TasksController_1.TasksController();
const walletController = new WalletController_1.WalletController();
const userController = new UserController_1.UserController();
const leaderboardController = new LeaderboardController_1.LeaderboardController();
const authRateLimiter = (0, rateLimit_middleware_1.createRateLimiter)(10, 60_000);
function validateAuthTelegramBody(body) {
    const payload = body;
    if (typeof payload?.initData !== "string" || payload.initData.length === 0) {
        throw AppError_1.appError.validation("initData is required", [
            { field: "initData", reason: "must be non-empty string" },
        ]);
    }
    if (typeof payload?.device?.platform !== "string") {
        throw AppError_1.appError.validation("device.platform is required", [
            { field: "device.platform", reason: "must be string" },
        ]);
    }
}
function validateTapBody(body) {
    const payload = body;
    if (typeof payload?.taps !== "number" ||
        !Number.isFinite(payload.taps) ||
        payload.taps <= 0) {
        throw AppError_1.appError.validation("Invalid taps", [
            { field: "taps", reason: "must be positive number" },
        ]);
    }
    if (typeof payload?.clientTs !== "number") {
        throw AppError_1.appError.validation("Invalid clientTs", [
            { field: "clientTs", reason: "must be number" },
        ]);
    }
    if (typeof payload?.nonce !== "string" || payload.nonce.length === 0) {
        throw AppError_1.appError.validation("Invalid nonce", [
            { field: "nonce", reason: "must be string" },
        ]);
    }
}
function validateWithdrawBody(body) {
    const payload = body;
    if (typeof payload?.amount !== "number" || payload.amount <= 0) {
        throw AppError_1.appError.validation("Invalid amount", [
            { field: "amount", reason: "must be positive number" },
        ]);
    }
    if (payload?.network !== "TON" && payload?.network !== "EVM") {
        throw AppError_1.appError.validation("Invalid network", [
            { field: "network", reason: "must be TON or EVM" },
        ]);
    }
    if (typeof payload?.address !== "string") {
        throw AppError_1.appError.validation("Invalid address", [
            { field: "address", reason: "must be string" },
        ]);
    }
}
function createV1Router() {
    const router = (0, express_1.Router)();
    router.post("/auth/telegram", authRateLimiter, (0, validation_middleware_1.validate)({ body: validateAuthTelegramBody }), authController.telegramLogin);
    router.post("/auth/refresh", authController.refresh);
    router.get("/me", telegramIdValidation_middleware_1.validateTelegramIdFromQuery, userController.me);
    router.post("/tap", telegramIdValidation_middleware_1.validateTelegramIdFromBody, tapRateLimit_middleware_1.tapRateLimitMiddleware, userController.tap);
    router.post("/daily", telegramIdValidation_middleware_1.validateTelegramIdFromBody, userController.daily);
    router.get("/leaderboard", leaderboardController.list);
    router.get("/game/state", auth_middleware_1.authMiddleware, gameController.getState);
    router.post("/game/tap", auth_middleware_1.authMiddleware, (0, validation_middleware_1.validate)({ headers: validation_middleware_1.requireIdempotencyKey, body: validateTapBody }), gameController.tap);
    router.get("/tasks", auth_middleware_1.authMiddleware, tasksController.list);
    router.post("/tasks/:taskId/claim", auth_middleware_1.authMiddleware, (0, validation_middleware_1.validate)({ headers: validation_middleware_1.requireIdempotencyKey }), tasksController.claim);
    router.post("/wallet/withdraw", auth_middleware_1.authMiddleware, (0, validation_middleware_1.validate)({ headers: validation_middleware_1.requireIdempotencyKey, body: validateWithdrawBody }), walletController.withdraw);
    router.get("/test/trigger-unhandled-error", auth_middleware_1.authMiddleware, () => {
        throw new Error("boom");
    });
    return router;
}
