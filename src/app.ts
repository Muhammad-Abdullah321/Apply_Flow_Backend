import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./modules/auth/auth.router.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import userRoutes from "./modules/users/user.router.js";
import applicationRoutes from "./modules/applications/application.router.js";
import dashboardRoutes from "./modules/dashboard/dashboard.router.js";
import resumeRoutes from "./modules/resumes/resume.router.js";
import settingsRoutes from "./modules/settings/settings.router.js";

<<<<<<< HEAD
// ES module __dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
=======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)

const app = express();

// CORS configuration for frontend integration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads as static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve static files from uploads folder
import path from "path";
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/settings", settingsRoutes);
app.use(errorMiddleware);

export default app;
