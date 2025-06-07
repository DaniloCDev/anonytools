import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv';

import router from './routes/auth.routes'


dotenv.config();


const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(router)

app.listen(3000, ()=> {
    console.log("Running serve in the port 300")
})