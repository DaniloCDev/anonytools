import {  Router } from "express";
import {  UserProxyController} from "../controllers/user.proxy.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();
const userProxyController = new UserProxyController();

router.patch("/user/createProxy", authenticateToken , userProxyController.registerUserProxy); 


export default router;