import jwt from "jsonwebtoken";
import createError from "./createError.js";

export const verifyToken = (req, res, next) => {
  // set token to current cookie
  const token = req.cookies.accessToken;
  if (!token) return next(createError(401, "you are not logged in "));
  // verify cookie and to next middleware
  jwt.verify(token, process.env.JWT, async (err, payload) => {
    if (err) return next(createError(403, " token is not valid"));
    // asign received data to be passed on
    req.userId = payload.id;
    req.isGert = payload.isGert;
    next();
  });
};
