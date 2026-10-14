import { Application } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AppException } from '../settings/common/exceptions/app.exception.js';
import type { DashboardQuery } from './dashboard.schema.js';

interface DashboardDateRange {
  from: string;
  to: string;
}

interface ApplicationTrendPoint {
  date: string;
  count: number;
}

interface StatusDistributionItem {
  status: string;
  count: number;
  percentage: number;
}

interface DashboardRecentApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  status: string;
  applicationDate: string;
}

interface DashboardSummary {
  totalApplications: number;
  applicationsThisWeek: number;
  applicationsThisMonth: number;
  interviews: number;
  offers: number;
  rejections: number;
  ghosted: number;
  responseRate: number;
}

interface DashboardData {
  summary: DashboardSummary;
  applicationTrend: ApplicationTrendPoint[];
  statusDistribution: StatusDistributionItem[];
  recentApplications: DashboardRecentApplication[];
  range: DashboardDateRange;
}

export class DashboardService {
  async getDashboard(userId: string, query: DashboardQuery): Promise<DashboardData> {
    const period = query.period;

    // Calculate date ranges
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    if (period === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === '30d' || period === 'month') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (period === '90d' || period === 'quarter') {
      startDate.setDate(startDate.getDate() - 90);
    }

    const weekAgo = new Date(endDate);
    weekAgo.setDate(endDate.getDate() - 7);
    
    const monthAgo = new Date(endDate);
    monthAgo.setMonth(endDate.getMonth() - 1);

    // Fetch all data in parallel
    const [totalApplications, pendingApplications, recentApplications, statusGroups, allApplications] = await Promise.all([
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
      prisma.application.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // Calculate summary stats
    const applicationsThisWeek = allApplications.filter(app => {
      const appDate = new Date(app.createdAt);
      return appDate >= weekAgo;
    }).length;

    const applicationsThisMonth = allApplications.filter(app => {
      const appDate = new Date(app.createdAt);
      return appDate >= monthAgo;
    }).length;

    const rejectedCount = statusGroups.find(s => s.status === 'REJECTED')?._count.status || 0;
    const ghostedCount = statusGroups.find(s => s.status === 'GHOSTED')?._count.status || 0;
    
    // Calculate response rate (rejections + ghosted / total * 100)
    const rejectedAndGhosted = rejectedCount + ghostedCount;
    const responseRate = totalApplications > 0 
      ? Math.round((rejectedAndGhosted / totalApplications) * 100)
      : 0;

    const summary: DashboardSummary = {
      totalApplications,
      applicationsThisWeek,
      applicationsThisMonth,
      interviews: statusGroups.find(s => s.status === 'INTERVIEW')?._count.status || 0,
      offers: statusGroups.find(s => s.status === 'OFFER')?._count.status || 0,
      rejections: rejectedCount,
      ghosted: ghostedCount,
      responseRate,
    };

    // Format status distribution
    const statusDistribution: StatusDistributionItem[] = statusGroups.map(item => ({
      status: item.status,
      count: item._count.status,
      percentage: totalApplications > 0 
        ? Math.round((item._count.status / totalApplications) * 100)
        : 0,
    }));

    // Format recent applications
    const recentApps: DashboardRecentApplication[] = recentApplications.map(app => ({
      id: app.id,
      jobTitle: app.jobTitle,
      companyName: app.company,
      status: app.status,
      applicationDate: app.applicationDate.toISOString(),
    }));

    // Build trend data
    const applicationTrend: ApplicationTrendPoint[] = this.buildTrendData(allApplications, startDate, endDate, period);

    return {
      summary,
      applicationTrend,
      statusDistribution,
      recentApplications: recentApps,
      range: {
        from: startDate.toISOString().split('T')[0],
        to: endDate.toISOString().split('T')[0],
      },
    };
  }

  private buildTrendData(applications: any[], startDate: Date, endDate: Date, period: string): ApplicationTrendPoint[] {
    const trend: ApplicationTrendPoint[] = [];
    
    if (period === 'month' || period === 'quarter') {
      // Weekly buckets
      const days = period === 'month' ? 30 : 90;
      const weeks = Math.ceil(days / 7);
      
      for (let i = 0; i < weeks; i++) {
        const date = new Date(endDate);
        date.setDate(endDate.getDate() - (i * 7));
        
        trend.push({
          date: date.toISOString().split('T')[0],
          count: 0, // Will be populated with actual data
        });
      }
    } else {
      // Daily buckets
      const days = period === '7d' ? 7 : 30;
      
      for (let i = 0; i < days; i++) {
        const date = new Date(endDate);
        date.setDate(endDate.getDate() - i);
        
        trend.push({
          date: date.toISOString().split('T')[0],
          count: 0, // Will be populated with actual data
        });
      }
    }

    return trend.reverse();
  }
}
