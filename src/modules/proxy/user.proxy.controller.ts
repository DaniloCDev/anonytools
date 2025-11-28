import { Request, Response } from "express";
import { ZodError } from "zod";
import ProxyUserService from "./user.proxy.services";


export class UserProxyController {
    /**
     *
     */
    constructor(private proxyUserService: ProxyUserService) {
    }

    /**
 * @swagger
 * /user/createProxy:
 *   patch:
 *     summary: Cria o proxy do usuário
 *     tags: [Proxy]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Proxy criado com sucesso.
 */
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

    /**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Retorna informações do usuário autenticado
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Informações do usuário encontradas com sucesso.
 *       401:
 *         description: Token ausente ou inválido.
 */
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

    /**
 * @swagger
 * /user/searchUsers:
 *   get:
 *     summary: Pesquisa usuários via admin
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuários encontrados.
 */
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

    /**
 * @swagger
 * /user/get-balance:
 *   get:
 *     summary: Retorna o saldo do usuário autenticado
 *     tags: [Balance]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Saldo retornado com sucesso.
 */
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

    /**
 * @swagger
 * /user/getBalance:
 *   get:
 *     summary: Retorna o saldo de qualquer usuário (admin)
 *     tags: [Balance]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Saldo retornado com sucesso.
 */
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

    /**
 * @swagger
 * /user/getUserProxy:
 *   get:
 *     summary: Retorna dados de configuração de proxy do usuário
 *     tags: [Proxy]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso.
 */
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

    /**
 * @swagger
 * /user/BlockUser:
 *   post:
 *     summary: Bloqueia ou desbloqueia um usuário (admin)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: string
 *                 example: "uuid-do-usuario"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 */
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

    /**
 * @swagger
 * /user/resetProxyPassword:
 *   get:
 *     summary: Reseta a senha do proxy do usuário
 *     tags: [Proxy]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Senha resetada com sucesso.
 */
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

    /**
 * @swagger
 * /user/updateProxyConfig:
 *   patch:
 *     summary: Atualiza quantidade de threads e país do proxy
 *     tags: [Proxy]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               threads:
 *                 type: number
 *               selectedCountry:
 *                 type: string
 *     responses:
 *       200:
 *         description: Configurações atualizadas com sucesso.
 */
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

    /**
 * @swagger
 * /user/getDashboard:
 *   get:
 *     summary: Retorna dados do dashboard
 *     tags: [Dashboard]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso.
 */
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