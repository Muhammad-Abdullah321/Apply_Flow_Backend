import { Router } from "express";
import {
  register,
  verifyOtp,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/logout", logout);

export default router;