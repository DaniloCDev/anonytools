import {  Router } from "express";
import {  UserProxyController} from "../controllers/user.proxy.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();
const userProxyController = new UserProxyController();

router.patch("/user/createProxy", authenticateToken , userProxyController.registerUserProxy); 
router.get("/user", authenticateToken , userProxyController.informationsUser); 



export default router;