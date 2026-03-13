import { appError } from "../../../shared/errors/AppError";
export function validate(rule) {
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
export function requireIdempotencyKey(req) {
    if (!req.header("Idempotency-Key")) {
        throw appError.validation("Idempotency-Key is required", [
            { field: "Idempotency-Key", reason: "header missing" },
        ]);
    }
}
