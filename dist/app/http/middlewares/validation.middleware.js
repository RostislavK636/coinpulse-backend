"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.requireIdempotencyKey = requireIdempotencyKey;
const AppError_1 = require("../../../shared/errors/AppError");
function validate(rule) {
    return (req, _res, next) => {
        try {
            rule.headers?.(req);
            rule.body?.(req.body, req);
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
function requireIdempotencyKey(req) {
    if (!req.header("Idempotency-Key")) {
        throw AppError_1.appError.validation("Idempotency-Key is required", [
            { field: "Idempotency-Key", reason: "header missing" },
        ]);
    }
}
