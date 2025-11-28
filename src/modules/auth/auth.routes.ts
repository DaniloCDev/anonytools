import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticateToken } from "../../core/middlewares/auth.middleware";
import { getLogsController } from "../logs/logs.controller";
import { validate } from "../../core/middlewares/auth.validate";
import { loginUserSchema } from "./dtos";
import { authContainer } from "./auth.container";

const router = Router();

const authController = new AuthController(
    authContainer.authUserService,
    authContainer.authOrchestrator
);


router.post("/auth/login",  validate(loginUserSchema),authController.login);
router.post("/auth/admin/login", validate(loginUserSchema),authController.loginAdmin);
router.get("/auth/check", authenticateToken, authController.authCheck);
router.post("/auth/logout", authenticateToken, authController.logout);

//  ─── Logs / Sistem ─────────────────────────────
router.get("/sistem/logs", authenticateToken,  async (req, res)=> {
    await getLogsController(req, res);
}); 


export default router;
