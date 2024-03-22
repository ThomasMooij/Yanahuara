import User from "@/models/User";
import { JWT_SECRET } from "@/utils/variables";
import { verify } from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
    const { authorization } = req.headers;

    const token = authorization?.split("Bearer ")[1];
    if (!token) return res.status(403).json({ error: "Unauthorized request!" });
    const payload = verify(token, JWT_SECRET)
  
    const id = payload.id;
  
    const user = await User.findOne({ _id: id, tokens: token });
    if (!user) return res.status(403).json({ error: "Unauthorized request!" });
  
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
    };
  
    next();
  };