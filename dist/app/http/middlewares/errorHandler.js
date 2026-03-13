"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../../../shared/errors/AppError");
function errorHandler(err, _req, res, _next) {
    console.error(err);
    if (err instanceof AppError_1.AppError) {
        return res.status(err.status).json({
            success: false,
            error: err.message,
        });
    }
    return res.status(500).json({
        success: false,
        error: "Internal Server Error",
    });
}
