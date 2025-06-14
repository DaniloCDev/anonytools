import {  Router } from "express";
import { AuthController } from "../controllers/user.auth.controller";

const router = Router();
const authController = new AuthController();

router.post("/user/register", authController.registerUser); 
router.post("/user/login", authController.login); 
router.get("/users", authController.allUsers); 


export default router;