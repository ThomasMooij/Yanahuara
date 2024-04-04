import User from "@/users"
import jwt from "jsonwebtoken"
import createError from "@utils/createError.js"
import { generateToken } from "@utils/generateToken.js"

export const login = async (req,res,next) =>{
    try{
        const {email, password} = req.body
        const user = await User.findOne({
          email
        })
      
        if (!user) return res.status(403).json({ error: "Email/Password mismatch!" });
      
        const matched = await user.comparePassword(password)
        if (!matched) return res.status(403).json({ error: "Email/Password mismatch!" });
      
        const token = jwt.sign({id: user._id }, JWT_SECRET)
      
        user.tokens.push(token);
      
        await user.save();
      
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
        const { email, password, firstName,lastName, phoneNumber } = req.body;

        const user = await User.create({ firstName,lastName, email, password, phoneNumber });

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

        const token = generateToken(6);

        transport.sendMail({
            to: user.email,
            from: "noreply@yanahuara.net",
            html: `<h1>Your verification token is${token}</h1>`,
          });
        

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
