"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const AppError_1 = require("../../shared/errors/AppError");
const v1_1 = require("../http/routes/v1");
const errorHandler_1 = require("../http/middlewares/errorHandler");
const requestLogger_1 = require("../http/middlewares/requestLogger");
const requestId_middleware_1 = require("../http/middlewares/requestId.middleware");
const tapRateLimit_middleware_1 = require("../http/middlewares/tapRateLimit.middleware");
const telegramIdValidation_middleware_1 = require("../http/middlewares/telegramIdValidation.middleware");
const LeaderboardController_1 = require("../http/controllers/LeaderboardController");
const TelegramWebhookController_1 = require("../http/controllers/TelegramWebhookController");
const TestController_1 = require("../http/controllers/TestController");
const UsersController_1 = require("../http/controllers/UsersController");
const UserController_1 = require("../http/controllers/UserController");
function createApp() {
    const app = (0, express_1.default)();
    const testController = new TestController_1.TestController();
    const usersController = new UsersController_1.UsersController();
    const userController = new UserController_1.UserController();
    const leaderboardController = new LeaderboardController_1.LeaderboardController();
    const telegramWebhookController = new TelegramWebhookController_1.TelegramWebhookController();
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 60_000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            error: "Too many requests",
        },
    });
    app.use((0, cors_1.default)({
        origin: ["https://tgapp-e3ade.web.app", "https://tgapp-e3ade.web.app/"],
        methods: ["GET", "POST", "OPTIONS"],
    }));
    app.use(express_1.default.json());
    app.use(requestLogger_1.requestLogger);
    app.use(limiter);
    app.use(requestId_middleware_1.requestIdMiddleware);
    app.get("/health", (_req, res) => {
        res.status(200).json({ status: "ok" });
    });
    app.get("/test", testController.handle);
    app.post("/telegram/webhook", telegramWebhookController.handle);
    app.post("/register", telegramIdValidation_middleware_1.validateTelegramIdFromBody, usersController.register);
    app.get("/me", telegramIdValidation_middleware_1.validateTelegramIdFromQuery, userController.me);
    app.post("/tap", telegramIdValidation_middleware_1.validateTelegramIdFromBody, tapRateLimit_middleware_1.tapRateLimitMiddleware, userController.tap);
    app.post("/daily", telegramIdValidation_middleware_1.validateTelegramIdFromBody, userController.daily);
    app.get("/leaderboard", leaderboardController.list);
    app.use("/api/v1", (0, v1_1.createV1Router)());
    app.use((_req, _res, next) => {
        next(AppError_1.appError.notFound("Route not found"));
    });
    app.use(errorHandler_1.errorHandler);
    return app;
}
