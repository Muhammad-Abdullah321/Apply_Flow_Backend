import {Router} from "express";
import { getMyProfile, updateMyProfile, deleteMyAccount } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/profile", authMiddleware, getMyProfile);
router.put("/profile", authMiddleware, updateMyProfile);
router.delete("/profile", authMiddleware, deleteMyAccount);

export default router;
