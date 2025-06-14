import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv';

import router from './routes/auth.routes'
import routerProxy from './routes/user.proxy.routes'

dotenv.config();

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(router)
app.use(routerProxy)


app.listen(3000, ()=> {
    console.log("Running serve in the port 300")
})