import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { SettingsController } from './settings.controller.js';

const router: Router = Router();
const settingsController = new SettingsController();

router.use(authMiddleware);

router.get('/', settingsController.getAllSettings);
router.patch('/system', settingsController.patchSystemSettings);
router.get('/:key', settingsController.getSettingByKey);
router.patch('/', settingsController.patchSettings);
router.put('/', settingsController.putSettings);

export default router;
