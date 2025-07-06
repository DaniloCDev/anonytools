import {  Router } from "express";
import { AuthController } from "../controllers/user.auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
const router = Router();
const authController = new AuthController();

router.post("/user/register", authController.registerUser); 
router.post("/user/login", authController.login); 
router.get("/auth/check", authenticateToken, authController.authCheck); 

export default router;