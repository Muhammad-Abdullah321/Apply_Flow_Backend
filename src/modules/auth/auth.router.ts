import { Router } from "express";
import {
  register,
  verifyOtp,
  login,
  me,
  logout,
  forgotPassword,
  resetPassword,
  resendOtp,
} from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/me", me);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/logout", logout);
router.post("/resend-otp", resendOtp);

export default router;