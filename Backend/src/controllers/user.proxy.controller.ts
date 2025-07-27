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
            //  console.log(userId)
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
        const { gbAmount, couponCode } = req.body;

        try {

            if (!userId) {
                res.status(401).json({ message: "Usuário não está logado" });
                return;
            }
            if (typeof gbAmount !== 'number' || gbAmount <= 0) {
                res.status(400).json({ message: "Quantidade de GB inválida" });
                return;
            }

            const gbPackages = [
                { gb: 1, price: 9.19 },
                { gb: 3, price: 26.99 },
                { gb: 5, price: 47.42 },
                { gb: 10, price: 77.9 },
                { gb: 20, price: 151.9 },
                { gb: 50, price: 372.00 },
            ];
            const selected = gbPackages.find(p => p.gb === gbAmount);
            if (!selected) {
                res.status(400).json({ message: "Pacote inválido" });
                return;
            }
            const usecase = new PurchaseService(new UserRepository());
            const purchase = await usecase.createPurchaseService(userId, selected?.gb, selected?.price, couponCode);
            //   console.log(purchase)

            res.status(200).json(purchase);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: (error as Error).message });

        }
    };

    informationsUser = async (req: Request, res: Response): Promise<void> => {

        const userId = req.userId;
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

    informationsUsers = async (req: Request, res: Response): Promise<void> => {

        const userId = req.userId;
        let query = String(req.query.q || "");

        const usecase = new ProxyUserService(new UserRepository());
        try {
            const user = await usecase.searchInfoUsers(userId, query);
            res.status(201).json(user);
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };

    purchaseHistory = async (req: Request, res: Response): Promise<void> => {

        const userId = req.userId;
        const usecase = new PurchaseService(new UserRepository());
        try {
            const user = await usecase.purchaseHistory(userId);
            //  console.log(userId)
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };

    GetCouponWithCode = async (req: Request, res: Response): Promise<void> => {
        const couponCode = req.query.code as string;
        if (!couponCode) {
            res.status(400).json({ message: 'Código do cupom é obrigatório' });
            return;
        }

        try {
            const usecase = new PurchaseService(new UserRepository());
            const coupon = await usecase.getCouponIsValid(couponCode);
            res.status(200).json(coupon);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    };


    getUserBalance = async (req: Request, res: Response): Promise<void> => {

        const userId = req.userId;
        //  console.log(userId)

        const usecase = new ProxyUserService(new UserRepository());
        try {
            const user = await usecase.getUserBalanceService(userId);
            //  console.log(usecase)
            res.status(201).json(user);
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };

    changePassword = async (req: Request, res: Response): Promise<void> => {

        const userId = req.userId;
        const usecase = new ProxyUserService(new UserRepository());
        try {
            const user = await usecase.changePasswordService(userId);
            // console.log(usecase)
            res.status(201).json(user);
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).json({ message: "Erro de validação", errors: error.format() });
            } else {
                res.status(400).json({ message: (error as Error).message });
            }
        }
    };

    updateProxythreads = async (req: Request, res: Response): Promise<void> => {

        const userId = req.userId;
        const body = req.body;

        console.log(body.threads, userId)
        if (!body.threads || body.threads == 0) throw new Error("valor do threads é nescessario");

        const usecase = new ProxyUserService(new UserRepository());
        try {
            const user = await usecase.updateProxyThreadsService(userId, body.threads);
            // console.log(usecase)
            res.status(201).json(user);
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