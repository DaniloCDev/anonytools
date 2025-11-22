import { Request, Response } from "express";
import AuthUserService from "./user.services";
import { UserOrchestrator } from "./user.orchestrator";

export class AuthController {

    constructor(
        private authService: AuthUserService,
        private orchestrator: UserOrchestrator
    ) {
    }
    register = async (req: Request, res: Response): Promise<void> => {
        const ip = req.ip ?? "";
        const dto = req.validated;

        const result = await this.orchestrator.registerUser(dto, ip);

        res.cookie("token", result.token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

         res.json(result);
    };

    changePasswordProfile = async (req: Request, res: Response): Promise<void> => {
        const { lastPassword, newPassword } = req.validated
        const userID = req.userId;
        const ip = req.ip ?? "";
        await this.authService.changePasswordService(userID, lastPassword, newPassword, ip);

        res.status(200).json({ message: "Senha alterada com sucesso" });

    };

    UpdateProfile = async (req: Request, res: Response): Promise<void> => {
        const details = req.body;
        const ip = req.ip ?? "";
        await this.authService.changePasswordUsersService(details.userId, details.newPassword, ip);
        res.status(200).json({ message: "Senha alterada com sucesso" });
    };

}