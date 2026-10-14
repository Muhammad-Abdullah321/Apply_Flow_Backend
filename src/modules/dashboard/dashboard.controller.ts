import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppException } from '../settings/common/exceptions/app.exception.js';
import { dashboardQuerySchema } from './dashboard.schema.js';
import { DashboardService } from './dashboard.service.js';

export class DashboardController {
  private readonly dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppException('Unauthorized: user not authenticated', 401);
      }

      const validatedQuery = dashboardQuerySchema.parse(req.query);

      const data = await this.dashboardService.getDashboard(userId, validatedQuery);

      res.status(200).json({
        message: 'Dashboard data fetched successfully',
        data,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Validation failed',
          errors: (error as any).errors.map((e: any) => ({
            field: e.path.join('.') || 'unknown',
            message: e.message,
          })),
        });
        return;
      }

      next(error);
    }
  };
}
