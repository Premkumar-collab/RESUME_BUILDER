import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { handleAsyncError } from "./handleAsynError.js";
import jwt from "jsonwebtoken";


export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } else {
    return next(new HandleError("Not authorized, no token found"));
  }
});
