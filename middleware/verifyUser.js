import dotenv from "dotenv"
import User from "../models/usersModel.js";
import { verify } from "jsonwebtoken";

dotenv.config()

export const verifyUser = async (req, res, next) => {


    const JWT_SECRET = process.env.JWT
    const { authorization } = req.headers;

    const token = authorization?.split("Bearer ")[1];
    if (!token) return res.status(403).json({ error: "Geen token" });
   
    const payload = verify(token, JWT_SECRET)
    const id = payload.id;

    const user = await User.findOne({ _id: id, tokens: token });
    if (!user) return res.status(403).json({ error: "Geen user" });
    
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.userType,
      verified: user.isVerified,
    };
  
    next();
  };