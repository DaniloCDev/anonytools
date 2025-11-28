import { Router } from "express";
import { PurchaseController } from "./payment.controller";
import { authenticateToken } from "../../core/middlewares/auth.middleware";
import { getLogsController } from "../logs/logs.controller";
import { paymentContainer } from "./payment.container";

const router = Router();

const purchaseController = new PurchaseController(
    paymentContainer.paymentOrchestrator,
    paymentContainer.paymentUserService,
);

// ─── Payments / Mercado Pago ─────────────────────────────
router.post("/webhook/mercadopago", purchaseController.mercadoPagoWebhook); 
router.post("/payment/check-payment-status", authenticateToken, purchaseController.checkPaymentStatus);

// ─── Coupons ──────────────────────────────────────────────
router.get("/coupons/validate", authenticateToken, purchaseController.GetCouponWithCode);
router.post("/coupons/createCoupon", authenticateToken, purchaseController.CreateCoupon);
router.get("/allcoupons", authenticateToken, purchaseController.ListAllCoupons);

// ─── Purchase ─────────────────────────────────────────────
router.post("/payment/createPurchase", authenticateToken, purchaseController.createPurchase);
router.get("/payment/purchases", authenticateToken, purchaseController.purchaseHistory);
router.get("/payment/purchasesAdm", authenticateToken, purchaseController.findPurchases);


//  ─── Logs / Sistem ─────────────────────────────
router.get("/sistem/logs", authenticateToken,  async (req, res)=> {
    await getLogsController(req, res);
}); 


export default router;
