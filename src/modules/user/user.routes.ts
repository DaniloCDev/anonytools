import { Router } from "express";
import { AuthController } from "./user.controller";
import { authenticateToken } from "../../core/middlewares/auth.middleware";
import { validate } from "../../core/middlewares/auth.validate";
import { registerUserSchema } from "./dtos";
import { changePasswordSchema } from "./dtos/ChangePasswordDTO";
import { getLogsController } from "../logs/logs.controller";
import { userContainer } from "./user.container";

const router = Router();

const authController = new AuthController(
    userContainer.authUserService,
    userContainer.userOrchestrator
);

// ─── Register ────────────────────────────────────────────────
router.post("/user/register", validate(registerUserSchema), authController.register);

// ─── Profile ────────────────────────────────────────────────
router.post("/user/change-password", validate(changePasswordSchema), authenticateToken, authController.changePasswordProfile);
router.put("/user/update-profile", authenticateToken, authController.UpdateProfile);

// ─── Logs ────────────────────────────────────────────────
router.get("/sistem/logs", authenticateToken, getLogsController);

export default router;
