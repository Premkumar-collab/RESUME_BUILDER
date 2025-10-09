import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password should be 8 characters long"],
      select: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
