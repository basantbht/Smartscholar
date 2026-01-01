import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from 'dotenv'
import { dbConnection } from "./src/database/db.js"
import userRouter from "./src/routes/user.route.js"

const app = express();

dotenv.config()

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api/v1/user", userRouter)

dbConnection()

export default app