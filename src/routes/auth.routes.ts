import { Router } from "express";
import { AuthController } from "../controllers/user.auth.controller";
import { PurchaseController } from "../controllers/user.mercadopago.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { getLogsController } from "../controllers/logs.controller";
import AuthUserService from "../services/auth.services";
import UserRepository from "../repository/user.repository";
import { validate } from "../middlewares/auth.validate";
import { loginUserSchema, registerUserSchema } from "../dtos";

const router = Router();

const authController = new AuthController(
    new AuthUserService(new UserRepository())
);

const purchaseController = new PurchaseController();

// ─── Auth ────────────────────────────────────────────────
router.post("/user/register", validate(registerUserSchema), authController.registerUser);
router.post("/user/login",  validate(loginUserSchema),authController.login);
router.post("/user/admin/login", validate(loginUserSchema),authController.loginAdmin);
router.get("/auth/check", authenticateToken, authController.authCheck);
router.post("/auth/logout", authenticateToken, authController.logout);

// ─── User Profile ────────────────────────────────────────
router.post("/user/ChangeUserPassword", authenticateToken, authController.changePasswordProfile);
router.put("/user/updateUser", authenticateToken, authController.UpdateProfile);

// ─── Payments / Mercado Pago ─────────────────────────────
router.post("/webhook/mercadopago", purchaseController.mercadoPagoWebhook); 
router.post("/user/check-payment-status", authenticateToken, purchaseController.checkPaymentStatus);

//  ─── Logs / Sistem ─────────────────────────────
router.get("/sistem/logs", authenticateToken,  async (req, res)=> {
    await getLogsController(req, res);
}); 


export default router;
