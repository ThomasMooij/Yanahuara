import express from 'express'
import dotenv from "dotenv"
import {mongoose} from "mongoose";
import cors from 'cors'
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import groupRoutes from './routes/groupRoutes.js'
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

//Library om geheime variables uit ENV file te halen. Denk aan jwt string. databse connection string etc
dotenv.config()
//zet express library in app variable zodat we verzoeken via url kunnen sturen. 
const app  = express()
const port = process.env.PORT
// beetje configuratie
app.use(express.json())
app.use(cors({origin:"http://localhost:5173" , credentials: true}))
app.use(cookieParser())
//url routes naar de controller functies. die kan de frontend dus gebruiken om json objecten op te vragen of shit te creeeren in onze db
// Alle auth functies bijv in de controller functies staan in de auth routes. 
// dus als de front end een fetch maakt naar 'api/auth/WELKEAUTHFUNCTIEDANOOK' krijgt ie terug wat er in die speficieke functie gereturnt wordt.
// bij post request geef je een json object terug met de nieuw aangemaakt waarde. 
// bij get geef je terug wat er geGET moet worden.
app.use('/api/auth' , authRoutes)
app.use('/api/groups', groupRoutes)

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