import User from "../models/usersModel.js"
import jwt from "jsonwebtoken"
import createError from "../utils/createError.js"
import dotenv from "dotenv"

import { generateToken } from "../utils/generateToken.js"

dotenv.config()

const JWT = process.env.JWT

export const login = async (req,res,next) =>{
    try{
         // request body object zijn variables die bij een post request door de frontend worden meegeven (via formulier)
        const {email, password} = req.body

        // kijk of in de User model een gebruiker bestaat met de email. Als die bestaat zetten we dit in het user variable voor manipulatie.
        //(aangezien email zoals de naam van de database property als de meegegeven waarde is hoef je niet email:email te doen zoals je miss zou verwachten)
        const user = await User.findOne({
          email
        })
        // Als er gebruiker wordt gevonden met de meegegeven email geef als response een error
        if (!user) return res.status(403).json({ error: "Email/Password mismatch!" });
      
        //In de user model zit een functie comparepassword. alle functions geschreven in de model kunnen aangeroepen worden zoals hieronder te zien is. 
        // Als compare password false retourneerd geven we als response aan de frontend een error
        const matched = await user.comparePassword(password)
        if (!matched) return res.status(403).json({ error: "Email/Password mismatch!" });
        
        // creer unique jwt token die de user id en onze geheimen string env variable JWT bevat. 
        //Stel iemand gaat zelf tokens in de localstorage proberen te zetten dan komt deze niet overeen met
        // de JWT string die in onze env file staat
        const token = jwt.sign({id: user._id }, JWT)
      
        // Token wordt toegevoegd aan de tokens attribuut van de user model in de database.
        // Deze token moet opgeslagen worden in de localstorage van het apparaat van de gebruiker. 
        // Deze wordt dan op de frontend uit de localstorage gehaald en vergeleken met de array van tokens in de users tokens.
        user.tokens.push(token);
      
        await user.save();
      
        // stuur json response met de waardes die je ziet naar de frontend
        res.json({
          profile: {
            id: user._id,
            name: user.name,
            email: user.email,
            verified: user.isVerified,
          },
          token, //to be saved in local/session storage.
        });
    }catch(err){
        createError(next(err))
    }
}

export const register = async (req,res,next) =>{
    try{  
        // request body object zijn variables die bij een post request door de frontend worden meegeven (via formulier)
        const { email, password, firstName,lastName, phoneNumber } = req.body;
        
        //waardes worden gebruikt om een user aan te maken in de database. met YUP moet middleware komen die een error geeft als niet alle waardes verschaft zijn.
        // ZIE ROUTES
        const user = await User.create({ firstName,lastName, email, password, phoneNumber });

        //BEGIN EMAIL VERIFICATIE
        // STUUR TOKEN VOOR VERIFICATIE FRONTEND

        // const transport = nodemailer.createTransport({
        //     host: "sandbox.smtp.mailtrap.io",
        //     port: 2525,
        //     auth: {
        //       user: MAILTRAP_USER,
        //       pass: MAILTRAP_PASSWORD,
        //     },
        //   });
        // IMPORT GENERATE TOKEN FROM FUNCTIONS 
        //   const token = generateToken(6);
        
        //   await EmailVerificationToken.create({
        //     owner: user._id,
        //     token,
        //   });
        
        //   transport.sendMail({
        //     to: user.email,
        //     from: "noreply@Yanhuara.net",
        //     html: `<h1>Your verification token is${token}</h1>`,
        //   });

        // const token = generateToken(6);

        // transport.sendMail({
        //     to: user.email,
        //     from: "noreply@yanahuara.net",
        //     html: `<h1>Your verification token is${token}</h1>`,
        //   });
        

        res.status(201).json({ user });

    }catch(err){
        next(err)
    }
}
export const logout = async (req,res,next) =>{
    try{
        res.clearCookie("accessToken" , {
            sameSite:"none",
            secure: true,
        }).status(200).send("user has been logged out")
    }catch(err){
        res.status(500).send("something went wrong")
    }
}
