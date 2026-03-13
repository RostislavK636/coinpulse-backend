"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const AppError_1 = require("../../../shared/errors/AppError");
function authMiddleware(req, _res, next) {
    const raw = req.header("authorization");
    if (!raw?.startsWith("Bearer ")) {
        return next(AppError_1.appError.unauthorized());
    }
    const token = raw.replace("Bearer ", "").trim();
    if (token !== "valid-access-token") {
        return next(AppError_1.appError.unauthorized());
    }
    req.authUserId = "user-1";
    next();
}
