import Resume from "../models/resumeModel.js";
import { handleAsyncError } from "../middleware/handleAsynError.js";
import HandleError from "../utils/handleError.js";
import fs from "fs";
import path from "path";
// create Resume
export const createResume = handleAsyncError(async (req, res, next) => {
  const { title } = req.body;

  const defaultResumeData = {
    profileInfo: {
      profileImg: null,
      previewUrl: "",
      fullName: "",
      designation: "",
      summary: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: "",
      },
    ],
    interests: [""],
  };

  const newResume = await Resume.create({
    userId: req.user._id,
    title,
    ...defaultResumeData,
    ...req.body,
  });

  res.status(201).json(newResume);
});

// get Resumes
export const getUserResumes = handleAsyncError(async (req, res, next) => {
  const resumes = await Resume.find({ userId: req.user._id }).sort({
    updatedAt: -1,
  });
  if (!resumes) {
    return next(new HandleError("Resume not found", 404));
  }
  res.status(200).json(resumes);
});

// get single resume
export const getSingleResume = handleAsyncError(async (req, res, next) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!resume) {
    return next(new HandleError("Resume not found", 404));
  }
  res.status(200).json(resume);
});

// update resume
export const updateResume = handleAsyncError(async (req, res, next) => {
  const resume = await Resume.findOne({
    userId: req.user._id,
    _id: req.params.id,
  });

  if (!resume) {
    return next(new HandleError("Resume not found or not authorized", 404));
  }

  // merge updated resume
  Object.assign(resume, req.body);

  // save the updated resume
  const savedResume = await resume.save();
  res.json(savedResume);
});

// Delete Resume
export const deleteResume = handleAsyncError(async (req, res, next) => {
  const resume = await Resume.findOne({
    userId: req.user._id,
    _id: req.params.id,
  });

  if (!resume) {
    return next(new HandleError("Resume not found or not authorized", 404));
  }

  // create the uploads folder
  const uploadFolder = path.join(process.cwd(), "uploads");

  // Delete thumbnailLink
  if (resume.thumbnailLink) {
    const oldLink = path.join(
      uploadFolder,
      path.basename(resume.thumbnailLink)
    );
    if (fs.existsSync(oldLink)) fs.unlinkSync(oldLink);
  }

  if (resume.profileInfo?.profilePreviewUrl) {
    const oldProfile = path.join(
      uploadFolder,
      path.basename(resume.profileInfo.profilePreviewUrl)
    );
    if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
  }

  const deleted = await Resume.findOneAndDelete({
    userId: req.user._id,
    _id: req.params.id,
  });

  if (!deleted) {
    return next(new HandleError("Resume not deleted", 400));
  }

  res.status(200).json({
    message: "Resume deleted",
  });
});
