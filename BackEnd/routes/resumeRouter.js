import express from "express";
import { verifyUserAuth } from "../middleware/authMiddleWare.js";
import {
  createResume,
  deleteResume,
  getSingleResume,
  getUserResumes,
  updateResume,
} from "../controllers/resumeController.js";
import { uploadImages } from "../controllers/uploadImages.js";

const resumeRouter = express.Router();

resumeRouter.post("/", verifyUserAuth, createResume);
resumeRouter.get("/", verifyUserAuth, getUserResumes);
resumeRouter.get("/:id", verifyUserAuth, getSingleResume);
resumeRouter.put("/:id", verifyUserAuth, updateResume);
resumeRouter.put("/:id/upload-images", verifyUserAuth, uploadImages);

resumeRouter.delete("/:id", verifyUserAuth, deleteResume);

export default resumeRouter;
