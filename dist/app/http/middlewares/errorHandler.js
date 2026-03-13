"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../../../shared/errors/AppError");
function errorHandler(err, req, res, _next) {
    console.error(err);
    if (err instanceof AppError_1.AppError) {
        return res.status(err.status).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                requestId: req.requestId,
                details: err.details,
            },
        });
    }
    return res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_ERROR",
            message: "Internal Server Error",
            requestId: req.requestId,
        },
    });
}
