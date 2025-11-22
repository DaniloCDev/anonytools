import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error("❌ Error:", err);

    const status = err.status || 400;
    const message = err.message || "Erro inesperado.";

    res.status(status).json({
        success: false,
        message,
    });
}
