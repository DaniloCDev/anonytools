import { Request, Response } from "express";
import UserRepository from "../repository/user.repository";
import { toUserResponseDTO, registerUserSchema, loginUserSchema } from "../dtos";
import { ZodError } from "zod";
import AuthUserService from "../services/auth.services";
import formatZodError from "../utils/formatErrorZod";

export class AuthController {
    registerUser = async (req: Request, res: Response): Promise<void> => {

        const usecase = new AuthUserService(new UserRepository());
        const result = registerUserSchema.safeParse(req.body);

        try {

            if (!result.success) {
                throw new ZodError(result.error.errors);
            }

            const user = await usecase.registerUser(result.data);

            console.log(user);
            const responseDTO = toUserResponseDTO(user);
            res.status(201).json(responseDTO);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {

        const usecase = new AuthUserService(new UserRepository());
        const result = loginUserSchema.safeParse(req.body);

        try {

            if (!result.success) {
                res.status(400).json({
                    message: "Erro de validação",
                    errors: formatZodError(result.error),
                });

                return;
            }

            const user = await usecase.LoginUser(result.data);
            const isProduction = process.env.NODE_ENV === "production";


            res.cookie("token", user.token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24000, // 1h
                sameSite: "lax",
                secure: isProduction,
            });
            res.status(200).json({ message: "Login successful" });
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };

    authCheck = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).json({ message: "Usuário autenticado", userId: req.userId });
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            res.cookie('token', '', { httpOnly: true, expires: new Date(0), path: '/' });
            res.status(200).send({ message: 'Logout successful' });
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };
}