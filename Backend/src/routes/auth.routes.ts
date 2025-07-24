import {  Router } from "express";
import { AuthController } from "../controllers/user.auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { PurchaseController } from "../controllers/user.mercadopago.controller";
const router = Router();
const authController = new AuthController();
const purchaseController = new PurchaseController();


router.post("/user/register", authController.registerUser); 
router.post("/user/login", authController.login); 
router.get("/auth/check", authenticateToken, authController.authCheck); 
router.post("/auth/logout", authenticateToken, authController.logout); 
router.post("/webhook/mercadopago", purchaseController.mercadoPagoWebhook); 
router.post("/user/checkPaymentStatus", authenticateToken, purchaseController.checkPaymentStatus);




export default router;