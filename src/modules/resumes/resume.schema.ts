import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
});

export const resumeIdParamSchema = z.object({
  id: z.string().uuid('Invalid resume ID format'),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type ResumeIdParam = z.infer<typeof resumeIdParamSchema>;
