import path from 'path';
import { Resume } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
<<<<<<< HEAD
import { AppException } from '../settings/common/exceptions/app.exception.js';
=======
import CustomError from '../../utils/exception.utils.js';
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)

export class ResumeService {
  async listResumes(userId: string, page: number = 1, limit: number = 10): Promise<any> {
    const skip = (page - 1) * limit;

    const [resumes, total] = await Promise.all([
      prisma.resume.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.resume.count({ where: { userId } }),
    ]);

    return {
      resumes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async getResumeById(userId: string, resumeId: string): Promise<Resume> {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
<<<<<<< HEAD
      throw new AppException('Resume not found', 404);
=======
      throw new CustomError(404, 'Resume not found');
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)
    }

    return resume;
  }

  async createResume(userId: string, input: any): Promise<Resume> {
    const filename = input.generatedFileName;
<<<<<<< HEAD
    const fileUrl = `/uploads/${filename}`;
=======
    const fileUrl = `/uploads/resumes/${filename}`;
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)

    try {
      return await prisma.resume.create({
        data: {
          userId,
          name: input.name,
          fileName: input.originalFileName,
          fileType: input.mimeType,
          fileUrl,
        },
      });
    } catch {
<<<<<<< HEAD
      const filePath = path.join('uploads', filename);
=======
      const filePath = path.join('uploads', 'resumes', filename);
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)
      try {
        const fs = await import('fs');
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch {
        // Ignore cleanup errors
      }
<<<<<<< HEAD
      throw new AppException('Failed to save resume', 500);
=======
      throw new CustomError(500, 'Failed to save resume');
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)
    }
  }

  async updateResumeName(userId: string, resumeId: string, name: string): Promise<Resume> {
    const existing = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!existing) {
<<<<<<< HEAD
      throw new AppException('Resume not found', 404);
=======
      throw new CustomError(404, 'Resume not found');
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)
    }

    return prisma.resume.update({
      where: { id: resumeId },
      data: { name },
    });
  }

  async deleteResume(userId: string, resumeId: string): Promise<void> {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
<<<<<<< HEAD
      throw new AppException('Resume not found', 404);
=======
      throw new CustomError(404, 'Resume not found');
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)
    }

    await prisma.resume.delete({ where: { id: resumeId } });

    const filename = resume.fileUrl.split('/').pop();
    if (filename) {
      const fs = await import('fs');
<<<<<<< HEAD
      const filePath = path.join('uploads', filename);
=======
      const filePath = path.join('uploads', 'resumes', filename);
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}
