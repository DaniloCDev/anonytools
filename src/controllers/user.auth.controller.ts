import { Request, Response } from "express";
import UserRepository from "../repository/user.repository";
import { toUserResponseDTO, registerUserSchema, loginUserSchema } from "../dtos";
import { ZodError } from "zod";
import AuthUserService from "../services/auth.services";

export class AuthController {
    registerUser = async (req: Request, res: Response): Promise<void> => {

        const usecase = new AuthUserService(new UserRepository());
        const result = registerUserSchema.safeParse(req.body);

        try {

            if (!result.success) {
                throw new ZodError(result.error.errors);
            }

            const user = await usecase.registerUser(result.data);
            console.log(user)
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
                throw new ZodError(result.error.errors);
            }

            const user = await usecase.LoginUser(result.data);

            res.status(201).json(user);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };

    allUsers = async (req: Request, res: Response): Promise<void> => {

       // const usecase = new LoginUserService(new UserRepository());
       // const result = loginUserSchema.safeParse(req.body);

        try {

           // if (!result.success) {
           //     throw new ZodError(result.error.errors);
           // }

     //     const user = await new UserRepository().allUsers();

          //  res.status(201).json(user);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };
}