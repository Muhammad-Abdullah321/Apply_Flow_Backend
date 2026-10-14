
import { Router } from "express";
import * as applicationController from "./application.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { addNoteSchema } from "./application.schema.js";

const router = Router();

router.use(authMiddleware);

router.post("/", applicationController.createApplication);
router.get("/", applicationController.getApplications);
router.get("/:id", applicationController.getApplicationById);
router.patch("/:id", applicationController.updateApplication);
router.patch("/:id/status", applicationController.updateApplicationStatus);
router.post("/:id/notes", applicationController.addNote);
router.delete("/:id", applicationController.deleteApplication);

export default router;
