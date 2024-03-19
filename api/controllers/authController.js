import User from "../models/usersModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import createError from "../functions/createError.js"

export const login = async (req,res,next) =>{
    try{
        const user = await User.findOne({guestname: req.body.guestname});
        if(!user) return res.status(404).send("username or password incorrect")
        const matched = await user.comparePassword(password)
        if (!matched) return res.status(403).json({ error: "Email/Password mismatch!" });
        //create cookie on login (niet best practice volgens mij kan isAdmin flag beter via de server meegevenw orden)
        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT)
        // get password out off user object so it is not send on completion
        const {password, isAdmin, ...info} = user._doc 
        //pass cookie up the chain
        res.cookie("accessToken", token , {
            httpOnly:true
        })
        res.status(200).send({details:{...info}, isAdmin})
    }catch(err){
        console.log(err)
    }
}



export const register = async (req,res,next) =>{
    try{  
        // encrypt sent password   
        const hash = bcrypt.hashSync(req.body.password, 5)
        // pass sent data to variable, set sent password to hashed password
        const newUser = new User({
           ...req.body,
           password:hash, //Volgens mij is hash niet meer nodig hier, verplaatst naar model
        })

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



        await newUser.save()
        res.status(200).send("user created")

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
