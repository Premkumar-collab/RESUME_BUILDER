import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { handleAsyncError } from "../middleware/handleAsynError.js";
import HandleError from "../utils/handleError.js";


// Generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Registration function
export const register = handleAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  // CHECK IF USER EXIST
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new HandleError("User already exists", 409));
  }

  if (password.length < 8) {
    return next(new HandleError("Password must be at least 8 characters", 400));
  }

  // hashing password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create new user
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// Login function
export const login = handleAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new HandleError("Invalid email or password", 401));
  }

  // COMPARE THE PASSWORD
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new HandleError("Invalid email or password", 401));
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// get user Details
export const getUserDetails = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return next(new HandleError("user not found!", 404));
  }
  res.status(200).json({
    user,
  });
});

