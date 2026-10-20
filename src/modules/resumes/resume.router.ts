import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
<<<<<<< HEAD
=======
import { uploadSingle } from '../../middlewares/upload.middleware.js';
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)
import { ResumeController } from './resume.controller.js';

const router: Router = Router();
const resumeController = new ResumeController();

router.use(authMiddleware);

router.get('/', resumeController.listResumes);
router.get('/:id', resumeController.getResume);
<<<<<<< HEAD
router.post('/', resumeController.uploadResume);
=======
router.post('/', uploadSingle, resumeController.uploadResume);
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)
router.patch('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);

export default router;
