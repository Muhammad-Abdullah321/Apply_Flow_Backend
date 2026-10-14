import { z } from 'zod';

export const dashboardQuerySchema = z.object({
  period: z.enum(['7d', '30d', '90d', 'month'] as const).optional().default('month'),
});

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
