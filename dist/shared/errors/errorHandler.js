"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("./AppError");
function errorHandler(err, req, res, _next) {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.status).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
                requestId: req.requestId,
            },
        });
    }
    return res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_ERROR",
            message: "Internal server error",
            requestId: req.requestId,
        },
    });
}
