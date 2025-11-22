import { Request, Response } from "express";
import { ZodError } from "zod";
import ProxyUserService from "./user.proxy.services";


export class UserProxyController {
    /**
     *
     */
    constructor(private proxyUserService: ProxyUserService) {
    }
    registerUserProxy = async (req: Request, res: Response): Promise<void> => {

        const userId = req.userId;

        try {
            const user = await this.proxyUserService.createUserProxy(userId);
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

    informationsUser = async (req: Request, res: Response): Promise<void> => {

        const userId = req.userId;
        try {
            const user = await this.proxyUserService.searchInfoUser(userId);
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

        try {
            const user = await this.proxyUserService.searchInfoUsers(userId, query);
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

    getUserBalance = async (req: Request, res: Response): Promise<void> => {

        const userId = req.userId;
        //  console.log(userId)

        try {
            const user = await this.proxyUserService.getUserBalanceService(userId);
            //  console.log(this.proxyUserService)
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

    getUserBalanceWithAdmin = async (req: Request, res: Response): Promise<void> => {

        const UserID = req.query.userID as string;

        try {
            const user = await this.proxyUserService.getUserBalanceService(UserID);
            //  console.log(this.proxyUserService)
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

    getUser = async (req: Request, res: Response): Promise<void> => {

        const userId = req.userId;
        try {
            const user = await this.proxyUserService.getUserService(userId);
            //  console.log(this.proxyUserService)
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

    blockUser = async (req: Request, res: Response): Promise<void> => {

        const body = req.body;
        const ip: string = req.ip || "";
        try {
            const user = await this.proxyUserService.BlockUser(body.id, ip);
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
        try {
            const user = await this.proxyUserService.changePasswordService(userId);
            // console.log(this.proxyUserService)
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
        const ip: string = req.ip || "";
        console.log(body.threads, userId)
        if (!body.threads || body.threads == 0) throw new Error("valor do threads é nescessario");

        try {
            const user = await this.proxyUserService.updateProxyThreadsService(userId, body.threads, body.selectedCountry, ip);
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

    GetDataDashboardController = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.proxyUserService.GetDataDashboard();
            //  console.log(this.proxyUserService)
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