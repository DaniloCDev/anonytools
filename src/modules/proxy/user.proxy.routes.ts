import { Router } from "express";
import { UserProxyController } from "./user.proxy.controller";
import { authenticateToken } from "../../core/middlewares/auth.middleware";
import { proxyContainer } from "./user.proxy.container";

const router = Router();
const userProxyController = new UserProxyController(proxyContainer.proxyUserService);

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
router.post("/user/BlockUser", authenticateToken, userProxyController.blockUser);

// ─── Balance ──────────────────────────────────────────────
router.get("/user/get-balance", authenticateToken, userProxyController.getUserBalance);
router.get("/user/getBalance", authenticateToken, userProxyController.getUserBalanceWithAdmin);


// ─── Admin - User Search ──────────────────────────────────
router.get("/user/searchUsers", authenticateToken, userProxyController.informationsUsers);


export default router;
