import dotenv from "dotenv"
import User from "../models/usersModel.js";
import { verify } from "jsonwebtoken";

dotenv.config()

export const verifyUser = async (req, res, next) => {

    // JWT is een env variable die jij aan moet maken (uiteindelijk wordt dat op de server het zelfde voor de hele app natuurlijk)
    // Wanneer een gebruiker aangemaakt wordt word deze zelfde string gebruikt en in de token verwerkt. 
    // Als deze functie de token uit de local storage van de gebruiker haalt wordt gegekeken of onze string gebruikt is bij het maken van de token
    const JWT_SECRET = process.env.JWT
    const { authorization } = req.headers;
    // Token verification en uit localstorage haal functionaliteit zoals hier boven beschreven. 
    const token = authorization?.split("Bearer ")[1];
    if (!token) return res.status(403).json({ error: "Unauthorized request!" });
    const payload = verify(token, JWT_SECRET)
    const id = payload.id;
    // Zoek user naar hand van ID van opgehaalde token.
    const user = await User.findOne({ _id: id, tokens: token });
    if (!user) return res.status(403).json({ error: "Unauthorized request!" });
    // geef de user details mee aan de volgende functie.
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.userType,
      verified: user.isVerified,
    };
  
    next();
  };