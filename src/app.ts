import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.router.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import userRoutes from "./modules/users/user.router.js";
import applicationRoutes from "./modules/applications/application.router.js";


const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use(errorMiddleware);

export default app;
