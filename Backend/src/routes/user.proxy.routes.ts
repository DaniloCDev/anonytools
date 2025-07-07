import {  Router } from "express";
import {  UserProxyController} from "../controllers/user.proxy.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();
const userProxyController = new UserProxyController();

router.patch("/user/createProxy", authenticateToken , userProxyController.registerUserProxy); 
router.post("/user/createPurchase", authenticateToken , userProxyController.createPurchase); 
router.get("/user/purchases", authenticateToken , userProxyController.purchaseHistory); 

router.get("/user/test",userProxyController.informationsUser); 

router.get("/user/me", authenticateToken , userProxyController.informationsUser); 



export default router;