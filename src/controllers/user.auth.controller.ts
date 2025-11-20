import { Request, Response } from "express";
import { registerUserSchema, loginUserSchema } from "../dtos";
import { ZodError } from "zod";
import AuthUserService from "../services/auth.services";
import { changePasswordSchema } from "../dtos/ChangePasswordDTO";

export class AuthController {

    constructor(private authService: AuthUserService) {
    }

    login = async (req: Request, res: Response): Promise<void> => {
        const data = req.validated
        const ip = req.ip ?? "";

        const user = await this.authService.LoginUser(data, ip);

        res.cookie("token", user.token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24000,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({ message: "Login successful" });
    };

    registerUser = async (req: Request, res: Response): Promise<void> => {
        const data = req.validated
        const ip = req.ip ?? "";

        const user = await this.authService.registerUser(data, ip);
        console.log(user);

        res.cookie("token", user.token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24000,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ message: "Login successful" });
    };

    loginAdmin = async (req: Request, res: Response): Promise<void> => {
        const data = req.validated
        const ip = req.ip ?? "";
        const user = await this.authService.LoginUserAdmin(data, ip);

        res.cookie("token", user.token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24000,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ message: "Login successful" });
    };

    changePasswordProfile = async (req: Request, res: Response): Promise<void> => {

        const userID = req.userId;
        const ip = req.ip ?? "";

        const { lastPassword, newPassword } = changePasswordSchema.parse(req.body)

        await this.authService.changePasswordService(userID, lastPassword, newPassword, ip);

        res.status(200).json({ message: "Senha alterada com sucesso" });

    };

    UpdateProfile = async (req: Request, res: Response): Promise<void> => {

        const usecase = this.authService;

        const details = req.body;
        const ip = req.ip ?? "";

        try {
            await usecase.changePasswordUsersService(details.userId, details.newPassword, ip);

            res.status(200).json({ message: "Senha alterada com sucesso" });
        } catch (error) {
            if (error instanceof ZodError) {
                const firstMessage = error.errors[0]?.message ?? "Erro de validação"
                res.status(400).json({ message: firstMessage })
            } else {
                res.status(400).json({ message: (error as Error).message })
            }
        }
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