import Resume from "../models/resumeModel.js";
import upload from "../middleware/uploadMiddleWare.js";
import fs from "fs";
import path from "path";
import { handleAsyncError } from "../middleware/handleAsynError.js";

export const uploadImages = handleAsyncError(async (req, res, next) => {
  // configure multer to handle images
  upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(
    req,
    res,
    async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload failed" });
      }

      const resume = await Resume.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      // use process cwd to locate the uploads folder
      const uploadFolder = path.join(process.cwd(), "uploads");
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const newThumbnail = req.files.thumbnail?.[0];
      const newProfileImage = req.files.profileImage?.[0];

      if (newThumbnail) {
        if (resume.thumbnailLink) {
          const oldThumnail = path.join(
            uploadFolder,
            path.basename(resume.thumbnailLink)
          );
          if (fs.existsSync(oldThumnail)) fs.unlinkSync(oldThumnail);
        }
        resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
      }

      // Same for the profileImage

      if (newProfileImage) {
        if (resume.profileInfo?.profilePreviewUrl) {
          const oldProfile = path.join(
            uploadFolder,
            path.basename(resume.profileInfo.profilePreviewUrl)
          );
          if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
        }
        resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
      }

      await resume.save();
      res.status(200).json({
        message: "Image upload successfully",
        thumbnailLink: resume.thumbnailLink,
        profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
      });
    }
  );
});

