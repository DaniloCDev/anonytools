import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import cors from "cors";
import authRouter from './modules/auth/auth.routes';
import proxyRouter from './modules/proxy/user.proxy.routes';
import userRouter from './modules/user/user.routes';
import paymentRouter from './modules/payments/payment.routes';
import { errorHandler } from "./core/middlewares/error.middleware";

import cookieParser from "cookie-parser";

const app = express()

app.use(cookieParser());
app.use(morgan("dev"))
app.use(express.json())

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.set("trust proxy", true);

app.use(authRouter)
app.use(proxyRouter)
app.use(userRouter)
app.use(paymentRouter)

app.use(errorHandler);


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
