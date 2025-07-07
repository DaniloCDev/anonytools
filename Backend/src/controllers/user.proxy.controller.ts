import { Request, Response } from "express";
import UserRepository from "../repository/user.repository";
import { ZodError } from "zod";
import ProxyUserService from "../services/user.proxy.services";
import PurchaseService from "../services/purchase.service";

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

    createPurchase = async (req: Request, res: Response): Promise<void> => {
        const userId = req.userId;
        const { gbAmount, totalPrice } = req.body;

        console.log(userId)
        try {
            if (!userId) throw new Error("Usuário não está logado");
            if (!gbAmount || !totalPrice) throw new Error("Dados incompletos");

            const gbPackages = [
                { gb: 5, price: 29.9 },
                { gb: 10, price: 49.9 },
                { gb: 25, price: 99.9 },
                { gb: 50, price: 179.9 },
                { gb: 100, price: 299.9 },
            ];
            const selected = gbPackages.find(p => p.gb === gbAmount);
            if (!selected) {
                res.status(400).json({ message: "Pacote inválido" });
                return;
            }
            const usecase = new PurchaseService(new UserRepository());
            const purchase = await usecase.createPurchase(userId, selected?.gb, selected?.price);
            console.log(purchase)

            res.status(200).json(purchase);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    };

    informationsUser = async (req: Request, res: Response): Promise<void> => {

        const userId = 'e1615c22-7b5f-47b6-8d72-03e7f23fd251';
        const usecase = new ProxyUserService(new UserRepository());
        try {
            const user = await usecase.searchInfoUser(userId);
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };

    purchaseHistory = async (req: Request, res: Response): Promise<void> => {

        const userId = 'e1615c22-7b5f-47b6-8d72-03e7f23fd251';
        const usecase = new PurchaseService(new UserRepository());
        try {
            const user = await usecase.purchaseHistory(userId);
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