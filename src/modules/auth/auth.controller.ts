import { Request, Response } from "express";
import { ZodError } from "zod";
import AuthUserService from "./auth.services";
import { AuthOrchestrator } from "./auth.orchestrator";

export class AuthController {

    constructor(
        private authService: AuthUserService,
        private authOrchestrator: AuthOrchestrator
    ) {
    }

    login = async (req: Request, res: Response): Promise<void> => {
        const ip = req.ip ?? "";

        const user = await this.authOrchestrator.login(req.validated, ip);

        res.cookie("token", user!.token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24000,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({ message: "Login successful" });
    };


    loginAdmin = async (req: Request, res: Response): Promise<void> => {
        const ip = req.ip ?? "";
        const user = await this.authService.LoginUserAdmin(req.validated, ip);

        res.cookie("token", user.token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24000,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ message: "Login successful" });
    };

    authCheck = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).json({ message: "Usuário autenticado", userId: req.userId });
        } catch (error) {
            if (error instanceof ZodError) {
                const firstMessage = error.errors[0]?.message ?? "Erro de validação"
                res.status(400).json({ message: firstMessage })
            } else {
                res.status(400).json({ message: (error as Error).message })
            }
        }
    };

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            res.cookie('token', '', { httpOnly: true, expires: new Date(0), path: '/' });
            res.status(200).send({ message: 'Logout successful' });
        } catch (error) {
            if (error instanceof ZodError) {
                const firstMessage = error.errors[0]?.message ?? "Erro de validação"
                res.status(400).json({ message: firstMessage })
            } else {
                res.status(400).json({ message: (error as Error).message })
            }
        }
    };
}