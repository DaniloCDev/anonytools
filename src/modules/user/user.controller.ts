import { Request, Response } from "express";
import AuthUserService from "./user.services";
import { UserOrchestrator } from "./user.orchestrator";

export class AuthController {

    constructor(
        private authService: AuthUserService,
        private orchestrator: UserOrchestrator
    ) {
    }

    /**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [User]
 *     description: Cria um novo usuário, gera um token JWT e salva no cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               name:
 *                 type: string
 *                 example: João da Silva
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       404:
 *         description: Email já está em uso.
 */
    register = async (req: Request, res: Response): Promise<void> => {
        const ip = req.ip ?? "";
        const dto = req.validated;

        const result = await this.orchestrator.registerUser(dto, ip);

        res.cookie("token", result.token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(201).json(result);
    };

    /**
 * @swagger
 * /user/change-password:
 *   put:
 *     summary: Altera a senha do usuário logado
 *     tags: [User]
 *     security:
 *       - cookieUser: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lastPassword
 *               - newPassword
 *             properties:
 *               lastPassword:
 *                 type: string
 *                 example: 123456
 *               newPassword:
 *                 type: string
 *                 example: 654321
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso.
 *       401:
 *         description: Token inválido ou ausente.
 *       400:
 *         description: Senha antiga incorreta.
 */
    changePasswordProfile = async (req: Request, res: Response): Promise<void> => {
        const { lastPassword, newPassword } = req.validated
        const userID = req.userId;
        const ip = req.ip ?? "";
        await this.authService.changePasswordService(userID, lastPassword, newPassword, ip);

        res.status(200).json({ message: "Senha alterada com sucesso" });

    };

    /**
 * @swagger
 * /user/update-profile:
 *   put:
 *     summary: Atualiza a senha de um usuário (Admin)
 *     tags: [User]
 *     description: Permite que administradores alterem a senha de qualquer usuário.
 *     security:
 *       - cookieUser: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - newPassword
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "92f8c0ad-8c1a-45bd-aad1-5d3c3cbf6e75"
 *               newPassword:
 *                 type: string
 *                 example: novaSenha123
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso.
 *       401:
 *         description: Token inválido ou ausente.
 *       404:
 *         description: Usuário não encontrado.
 */
    UpdateProfile = async (req: Request, res: Response): Promise<void> => {
        const details = req.body;
        const ip = req.ip ?? "";
        await this.authService.changePasswordUsersService(details.userId, details.newPassword, ip);
        res.status(200).json({ message: "Senha alterada com sucesso" });
    };

}