import { Request, Response } from "express";
import UserRepository from "../repository/user.repository";
import { ZodError } from "zod";
import ProxyUserService from "../services/user.proxy.services";

export class UserProxyController {
    registerUserProxy = async (req: Request, res: Response): Promise<void> => {

        const userId = req.userId;
        const usecase = new ProxyUserService(new UserRepository());

        try {
            const user = await usecase.createUserProxy(userId);
            console.log(userId)
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };

    addTrafficInToBalance = async (req: Request, res: Response): Promise<void> => {

        const userId = req.userId;
        const usecase = new ProxyUserService(new UserRepository());

        try {
            const user = await usecase.createUserProxy(userId);
            console.log(userId)
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };

    informationsUser = async (req: Request, res: Response): Promise<void> => {

        const userId = req.userId;
        const usecase = new ProxyUserService(new UserRepository());
        try {
            const user = await usecase.searchInfoUser(userId);
            console.log(user)
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };
}