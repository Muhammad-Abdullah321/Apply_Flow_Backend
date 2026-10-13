import { Application } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AppException } from '../settings/common/exceptions/app.exception.js';
import type { DashboardQuery } from './dashboard.schema.js';

interface DashboardData {
  totalApplications: number;
  pendingApplications: number;
  recentApplications: Application[];
  statusDistribution: Record<string, number>;
  applicationTrends: { labels: string[]; data: number[] };
}

export class DashboardService {
  async getDashboard(userId: string, query: DashboardQuery): Promise<DashboardData> {
    const period = query.period;

    const [totalApplications, pendingApplications, recentApplications, statusGroups] = await Promise.all([
      prisma.application.count({ where: { userId } }),
      prisma.application.count({ where: { userId, status: { in: ['APPLIED', 'SCREENING', 'INTERVIEW'] } } }),
      prisma.application.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.application.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true },
      }),
    ]);

    const statusDistribution = statusGroups.reduce((acc, item: any) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalApplications,
      pendingApplications,
      recentApplications,
      statusDistribution,
      applicationTrends: { labels: [], data: [] },
    };
  }
}
