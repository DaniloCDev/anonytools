import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv';
import cors from "cors";

import router from './routes/auth.routes'
import routerProxy from './routes/user.proxy.routes'
import cookieParser from "cookie-parser";

dotenv.config();

const app = express()

app.use(cookieParser());
app.use(morgan("dev"))
app.use(express.json())

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(router)
app.use(routerProxy)


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
