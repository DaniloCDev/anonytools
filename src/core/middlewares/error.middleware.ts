import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err.statusCode 
    const message = err.message || "Erro inesperado.";

    res.status(status).json({
        success: false,
        message,
    });
}
