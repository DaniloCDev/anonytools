import { Request, Response } from "express";
import UserRepository from "../repository/user.repository";
import { registerUserSchema, loginUserSchema } from "../dtos";
import { ZodError } from "zod";
import AuthUserService from "../services/auth.services";
import { changePasswordSchema } from "../dtos/ChangePasswordDTO";

export class AuthController {

    registerUser = async (req: Request, res: Response): Promise<void> => {

        const usecase = new AuthUserService(new UserRepository());
        const result = registerUserSchema.safeParse(req.body);
        const ip: string = req.ip || "";

        try {

            if (!result.success) {
                throw new ZodError(result.error.errors);
            }

            const user = await usecase.registerUser(result.data, ip);

            console.log(user);

            const isProduction = process.env.NODE_ENV === "production";
            res.cookie("token", user.token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24000, // 24h
                sameSite: "lax",
                secure: isProduction,
            });
            res.status(200).json({ message: "Login successful" });
        } catch (error) {
            if (error instanceof ZodError) {
                const firstMessage = error.errors[0]?.message || "Erro de validação"
                res.status(400).json({ message: firstMessage })
            } else {
                res.status(400).json({ message: (error as Error).message })
            }

        }
    };

    loginAdmin = async (req: Request, res: Response): Promise<void> => {

        const usecase = new AuthUserService(new UserRepository());
        const result = loginUserSchema.safeParse(req.body);
        const ip: string = req.ip || "";

        try {

            if (!result.success) {
                throw new ZodError(result.error.errors);
            }

            const user = await usecase.LoginUserAdmin(result.data, ip);
            const isProduction = process.env.NODE_ENV === "production";


            res.cookie("token", user.token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24000, // 24h
                sameSite: "lax",
                secure: isProduction,
            });
            res.status(200).json({ message: "Login successful" });
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                const firstMessage = error.errors[0]?.message || "Erro de validação"
                res.status(400).json({ message: firstMessage })
            } else {
                res.status(400).json({ message: (error as Error).message })
            }
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {

        const usecase = new AuthUserService(new UserRepository());
        const result = loginUserSchema.safeParse(req.body);
        const ip: string = req.ip || "";
        try {

            if (!result.success) {
                throw new ZodError(result.error.errors);
            }

            const user = await usecase.LoginUser(result.data, ip);
            const isProduction = process.env.NODE_ENV === "production";


            res.cookie("token", user.token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24000, // 24h
                sameSite: "lax",
                secure: isProduction,
            });
            res.status(200).json({ message: "Login successful" });
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                const firstMessage = error.errors[0]?.message || "Erro de validação"
                res.status(400).json({ message: firstMessage })
            } else {
                res.status(400).json({ message: (error as Error).message })
            }
        }
    };

    changePasswordProfile = async (req: Request, res: Response): Promise<void> => {

        const usecase = new AuthUserService(new UserRepository());
        const userID = req.userId;
        const ip: string = req.ip || "";

        try {
            const { lastPassword, newPassword } = changePasswordSchema.parse(req.body)

            await usecase.changePasswordService(userID, lastPassword, newPassword, ip);

            res.status(200).json({ message: "Senha alterada com sucesso" });
        } catch (error) {
            if (error instanceof ZodError) {
                const firstMessage = error.errors[0]?.message || "Erro de validação"
                res.status(400).json({ message: firstMessage })
            } else {
                res.status(400).json({ message: (error as Error).message })
            }
        }
    };

    UpdateProfile = async (req: Request, res: Response): Promise<void> => {

        const usecase = new AuthUserService(new UserRepository());
        const details = req.body;
        const ip: string = req.ip || "";

        try {
            // const { newPassword } = changePasswordSchema.parse(req.body)

            //   console.log(id. password , "controller")
            await usecase.changePasswordUsersService(details.userId, details.newPassword, ip);

            res.status(200).json({ message: "Senha alterada com sucesso" });
        } catch (error) {
            if (error instanceof ZodError) {
                const firstMessage = error.errors[0]?.message || "Erro de validação"
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
                const firstMessage = error.errors[0]?.message || "Erro de validação"
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
                const firstMessage = error.errors[0]?.message || "Erro de validação"
                res.status(400).json({ message: firstMessage })
            } else {
                res.status(400).json({ message: (error as Error).message })
            }
        }
    };
}