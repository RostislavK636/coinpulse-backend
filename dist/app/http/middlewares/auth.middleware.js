import { appError } from "../../../shared/errors/AppError";
export function authMiddleware(req, _res, next) {
    const raw = req.header("authorization");
    if (!raw?.startsWith("Bearer ")) {
        return next(appError.unauthorized());
    }
    const token = raw.replace("Bearer ", "").trim();
    if (token !== "valid-access-token") {
        return next(appError.unauthorized());
    }
    req.authUserId = "user-1";
    next();
}
