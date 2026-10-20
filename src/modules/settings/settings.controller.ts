import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
<<<<<<< HEAD
import { AppException } from './common/exceptions/app.exception.js';
=======
import CustomError from '../../utils/exception.utils.js';
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)
import { SettingsService } from './settings.service.js';

export class SettingsController {
  private readonly settingsService: SettingsService;

  constructor() {
    this.settingsService = new SettingsService();
  }

  getAllSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const isAdmin = req.user?.role === 'ADMIN';

      const data = await this.settingsService.getAllSettings(userId!, isAdmin);

      res.status(200).json({ message: 'Settings fetched successfully', data });
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  getSettingByKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const isAdmin = req.user?.role === 'ADMIN';
      const { key } = req.params;

      const data = await this.settingsService.getSettingByKey(userId!, key as string, isAdmin);

      res.status(200).json({ message: 'Setting fetched successfully', data });
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  patchSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const body = req.body;

      const data = await this.settingsService.patchUserSettings(userId!, body);

      res.status(200).json({ message: 'Settings updated successfully', data });
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  putSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const body = req.body;

      const data = await this.settingsService.putUserSettings(userId!, body);

      res.status(200).json({ message: 'Settings replaced successfully', data });
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  patchSystemSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body;

      const data = await this.settingsService.patchSystemSettings(body);

      res.status(200).json({ message: 'System settings updated successfully', data });
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  handleError = (error: unknown, res: Response, next: NextFunction): void => {
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
  };
}
