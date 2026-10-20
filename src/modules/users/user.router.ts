import {Router} from "express";
import { getMyProfile, updateMyProfile, deleteMyAccount, changePassword } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

<<<<<<< HEAD
// Profile routes - frontend expects /users/me
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);
router.delete("/me", authMiddleware, deleteMyAccount);
router.post("/me/password", authMiddleware, changePassword);

// Profile routes - backend uses /profile
=======
// Profile routes - backend uses /profile (existing)
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)
router.get("/profile", authMiddleware, getMyProfile);
router.put("/profile", authMiddleware, updateMyProfile);
router.delete("/profile", authMiddleware, deleteMyAccount);

// Profile routes - frontend expects /me (new)
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);
router.delete("/me", authMiddleware, deleteMyAccount);

export default router;
