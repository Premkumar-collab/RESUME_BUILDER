import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import errorMiddleWare from "./middleware/error.js";
import userRouter from "./routes/userRouter.js";
import resumeRouter from "./routes/resumeRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Logging
app.use(morgan("dev"));

// JSON parsing
app.use(express.json());

// Static file serving with CORS headers
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, _path) => {
    res.set("Access-Control-Allow-Origin", "http://localhost:5173");
  }
}));

// Routes
app.use("/api/auth", userRouter);
app.use("/api/resume", resumeRouter);

// Error handler
app.use(errorMiddleWare);

export default app;