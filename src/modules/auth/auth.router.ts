import { Router } from "express";
import {
  register,
  verifyOtp,
  login,
  logout,
} from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", logout);

export default router;