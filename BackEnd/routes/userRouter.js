import express from "express";
import {
  register,
  login,
  getUserDetails,
} from "../controllers/userController.js";
import { verifyUserAuth } from "../middleware/authMiddleWare.js";
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);

// protected Route as token is required
userRouter.get("/profile", verifyUserAuth, getUserDetails);

export default userRouter;
