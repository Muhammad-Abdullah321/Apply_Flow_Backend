import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppException } from '../settings/common/exceptions/app.exception.js';
import { ResumeService } from './resume.service.js';

export class ResumeController {
  private readonly resumeService: ResumeService;

  constructor() {
    this.resumeService = new ResumeService();
  }

  listResumes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { page, limit } = req.query;

      const result = await this.resumeService.listResumes(userId!, Number(page), Number(limit));

      res.status(200).json({ message: 'Resumes fetched successfully', data: result });
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  getResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params as { id: string };

      const resume = await this.resumeService.getResumeById(userId!, id);

      res.status(200).json({ message: 'Resume fetched successfully', data: resume });
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  uploadResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { name } = req.body;

      if (!req.file) {
        throw new AppException('No file uploaded', 400);
      }

      const resume = await this.resumeService.createResume(userId!, {
        name: name || 'Resume',
        originalFileName: req.file.originalname,
        generatedFileName: req.file.filename,
        mimeType: req.file.mimetype,
      });

      res.status(201).json({ message: 'Resume uploaded successfully', data: resume });
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  updateResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params as { id: string };
      const { name } = req.body;

      const updated = await this.resumeService.updateResumeName(userId!, id, name);

      res.status(200).json({ message: 'Resume updated successfully', data: updated });
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  deleteResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params as { id: string };

      await this.resumeService.deleteResume(userId!, id);

      res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  handleError = (error: unknown, res: Response, next: NextFunction): void => {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Validation failed', errors: (error as any).errors });
      return;
    }
    next(error);
  };
}
