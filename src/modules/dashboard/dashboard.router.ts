import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { DashboardController } from './dashboard.controller.js';

const router: Router = Router();
const dashboardController = new DashboardController();

router.get('/', authMiddleware, dashboardController.getDashboard);

export default router;
