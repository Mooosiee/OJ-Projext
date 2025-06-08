import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(errorHandler(401, "You are not authenticated!"));
  //When you jwt.sign({ id: validUser._id }, ...) during login, the decoded payload 
  // (which becomes req.user after jwt.verify) will have req.user.id.
  jwt.verify(token, process.env.SECRET_KEY, (err, decodedUserPayload) => {
    if (err) return next(errorHandler(403, "Forbidden!"));
    console.log("[verifyToken] Decoded User Payload:", decodedUserPayload); 
    req.user = decodedUserPayload;
    next();
  });
};
