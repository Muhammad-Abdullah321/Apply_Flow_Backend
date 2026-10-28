import path from 'path';
import { Resume } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AppException } from '../settings/common/exceptions/app.exception.js';

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
      throw new AppException('Resume not found', 404);
    }

    return resume;
  }

  async createResume(userId: string, input: any): Promise<Resume> {
    const filename = input.generatedFileName;
    const fileUrl = `/uploads/${filename}`;

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
      const filePath = path.join('uploads', filename);
      try {
        const fs = await import('fs');
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch {
        // Ignore cleanup errors
      }
      throw new AppException('Failed to save resume', 500);
    }
  }

  async updateResumeName(userId: string, resumeId: string, name: string): Promise<Resume> {
    const existing = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!existing) {
      throw new AppException('Resume not found', 404);
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
      throw new AppException('Resume not found', 404);
    }

    await prisma.resume.delete({ where: { id: resumeId } });

    const filename = resume.fileUrl.split('/').pop();
    if (filename) {
      const fs = await import('fs');
      const filePath = path.join('uploads', filename);
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
