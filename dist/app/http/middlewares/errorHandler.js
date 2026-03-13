import { AppError } from "../../../shared/errors/AppError";
export function errorHandler(err, _req, res, _next) {
    console.error(err);
    if (err instanceof AppError) {
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
