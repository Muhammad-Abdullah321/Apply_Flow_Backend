import {Router} from "express";
import { getMyProfile, updateMyProfile, deleteMyAccount, changePassword } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Profile routes - frontend expects /users/me
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);
router.delete("/me", authMiddleware, deleteMyAccount);
router.post("/me/password", authMiddleware, changePassword);

// Profile routes - backend uses /profile
router.get("/profile", authMiddleware, getMyProfile);
router.put("/profile", authMiddleware, updateMyProfile);
router.delete("/profile", authMiddleware, deleteMyAccount);

export default router;
