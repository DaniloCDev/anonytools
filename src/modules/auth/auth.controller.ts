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

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login do usuario
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: admin@gmail.com
     *               password:
     *                 type: string
     *                 example: 123456
     *     responses:
     *       200:
     *         description: Login realizado com sucesso.
     *       401:
     *         description: Senha inválida.
     *       404:
     *         description: Email não encontrado.
    */
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

    /**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     summary: Login do usuario admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *       401:
 *         description: Senha inválida.
 *       403:
 *         description:Acesso negado usuário não é administrador.
*/
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

    /**
     * @swagger
     * /auth/check:
     *   get:
     *     summary: verifica se o usuario ta autenticado
     *     tags: [Auth]
     *     description: Retorna o ID do usuário autenticado baseado no token JWT armazenado no cookie.
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Usuário autenticado.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Usuário autenticado
     *                 userId:
     *                   type: string
     *                   example: "92f8c0ad-8c1a-45bd-aad1-5d3c3cbf6e75"
     *       401:
     *         description: Token ausente ou inválido.
     */
    authCheck = async (req: Request, res: Response): Promise<void> => {
        res.status(200).json({ message: "Usuário autenticado", userId: req.userId });
    };


    /**
     * @swagger
     * /auth/logout:
     *   post:
     *     summary: Encerra a sessão do usuário
     *     tags: [Auth]
     *     description: Remove o token JWT armazenado no cookie, encerrando a sessão do usuário.
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Logout realizado com sucesso.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Logout successful
     *       401:
     *         description: Token ausente ou inválido.
     */
    logout = async (req: Request, res: Response): Promise<void> => {
        res.cookie('token', '', { httpOnly: true, expires: new Date(0), path: '/' });
        res.status(200).send({ message: 'Logout successful' });
    };

}