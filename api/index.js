import express from 'express'
import dotenv from "dotenv"
import {mongoose} from "mongoose";
import cors from 'cors'
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config()

const app  = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors({origin:"http://localhost:5173" , credentials: true}))
app.use(cookieParser())

app.use('/api/auth' , authRoutes)
app.use('/api/upload', uploadRoutes)

mongoose.set("strictQuery" , true)

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to mongoDB")
    } catch (error) {
        throw(error);
    }
}

app.listen(port, () => 
{
    connect()
    console.log(`http://localhost:${port}`)
})