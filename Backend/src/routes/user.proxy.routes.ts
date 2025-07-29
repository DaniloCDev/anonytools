import { Router } from "express";
import { UserProxyController } from "../controllers/user.proxy.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();
const userProxyController = new UserProxyController();

// ─── Authenticated User Info ──────────────────────────────
router.get("/user/me", authenticateToken, userProxyController.informationsUser);
router.get("/user/test", userProxyController.informationsUser); 

// ─── Dashboard ────────────────────────────────────────────
router.get("/user/getDashboard", authenticateToken, userProxyController.GetDataDashboardController);

// ─── Proxy Configurations ─────────────────────────────────
router.get("/user/getUserProxy", authenticateToken, userProxyController.getUser);
router.patch("/user/createProxy", authenticateToken, userProxyController.registerUserProxy);
router.patch("/user/updateProxyConfig", authenticateToken, userProxyController.updateProxythreads);
router.get("/user/resetProxyPassword", authenticateToken, userProxyController.changePassword);
router.post("/user/deleteUse", authenticateToken, userProxyController.deleteUser);

// ─── Purchase ─────────────────────────────────────────────
router.post("/user/createPurchase", authenticateToken, userProxyController.createPurchase);
router.get("/user/purchases", authenticateToken, userProxyController.purchaseHistory);

// ─── Balance ──────────────────────────────────────────────
router.get("/user/get-balance", authenticateToken, userProxyController.getUserBalance);

// ─── Coupons ──────────────────────────────────────────────
router.get("/coupons/validate", authenticateToken, userProxyController.GetCouponWithCode);
router.post("/coupons/createCoupon", authenticateToken, userProxyController.CreateCoupon);
router.get("/allcoupons", authenticateToken, userProxyController.ListAllCoupons);

// ─── Admin - User Search ──────────────────────────────────
router.get("/user/searchUsers", authenticateToken, userProxyController.informationsUsers);

export default router;
