import {Router} from "express";
import { getMyProfile, updateMyProfile, deleteMyAccount, changePassword } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Profile routes - /users/me is the standard endpoint (removed duplicate /profile routes)
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);
router.patch("/me", authMiddleware, updateMyProfile); // Support PATCH as well
router.delete("/me", authMiddleware, deleteMyAccount);
router.post("/me/password", authMiddleware, changePassword);

export default router;
