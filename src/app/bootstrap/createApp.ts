import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { appError } from "../../shared/errors/AppError";
import { createV1Router } from "../http/routes/v1";
import { errorHandler } from "../http/middlewares/errorHandler";
import { requestLogger } from "../http/middlewares/requestLogger";
import { requestIdMiddleware } from "../http/middlewares/requestId.middleware";
import { tapRateLimitMiddleware } from "../http/middlewares/tapRateLimit.middleware";
import {
  validateTelegramIdFromBody,
  validateTelegramIdFromQuery,
} from "../http/middlewares/telegramIdValidation.middleware";
import { LeaderboardController } from "../http/controllers/LeaderboardController";
import { TestController } from "../http/controllers/TestController";
import { UsersController } from "../http/controllers/UsersController";
import { UserController } from "../http/controllers/UserController";

export function createApp() {
  const app = express();
  const testController = new TestController();
  const usersController = new UsersController();
  const userController = new UserController();
  const leaderboardController = new LeaderboardController();

  const limiter = rateLimit({
    windowMs: 60_000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: "Too many requests",
    },
  });

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST"],
    }),
  );
  app.use(express.json());
  app.use(requestLogger);
  app.use(limiter);
  app.use(requestIdMiddleware);

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/test", testController.handle);
  app.post("/register", validateTelegramIdFromBody, usersController.register);
  app.get("/me", validateTelegramIdFromQuery, userController.me);
  app.post(
    "/tap",
    validateTelegramIdFromBody,
    tapRateLimitMiddleware,
    userController.tap,
  );
  app.post("/daily", validateTelegramIdFromBody, userController.daily);
  app.get("/leaderboard", leaderboardController.list);

  app.use("/api/v1", createV1Router());

  app.use((_req, _res, next) => {
    next(appError.notFound("Route not found"));
  });

  app.use(errorHandler);

  return app;
}
