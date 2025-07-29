import { Router } from "express";
import { AuthController } from "../controllers/user.auth.controller";
import { PurchaseController } from "../controllers/user.mercadopago.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { getLogsController } from "../controllers/logs.controller";

const router = Router();
const authController = new AuthController();
const purchaseController = new PurchaseController();

// ─── Auth ────────────────────────────────────────────────
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.login);
router.post("/user/admin/login", authController.loginAdmin);
router.get("/auth/check", authenticateToken, authController.authCheck);
router.post("/auth/logout", authenticateToken, authController.logout);

// ─── User Profile ────────────────────────────────────────
router.post("/user/change-password", authenticateToken, authController.changePasswordProfile);
router.put("/user/update", authenticateToken, authController.UpdateProfile);

// ─── Payments / Mercado Pago ─────────────────────────────
router.post("/webhook/mercadopago", purchaseController.mercadoPagoWebhook); 
router.post("/user/check-payment-status", authenticateToken, purchaseController.checkPaymentStatus);

//  ─── Logs / Sistem ─────────────────────────────
router.get("/sistem/logs", authenticateToken,  async (req, res)=> {
    await getLogsController(req, res);
}); 


export default router;
