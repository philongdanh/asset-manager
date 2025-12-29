import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import {
  IMaintenanceScheduleRepository,
  MaintenanceSchedule,
  MaintenanceStatus,
  MaintenanceType,
} from '../../../domain';
import { PrismaService } from '../../../../../infrastructure/persistence/prisma/prisma.service';
import { MaintenanceScheduleMapper } from '../mappers/maintenance-schedule.mapper';

@Injectable()
export class PrismaMaintenanceScheduleRepository implements IMaintenanceScheduleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(maintenanceId: string): Promise<MaintenanceSchedule | null> {
    const raw = await this.prisma.maintenanceSchedule.findUnique({
      where: { id: maintenanceId },
    });
    return raw ? MaintenanceScheduleMapper.toDomain(raw) : null;
  }

  async findByAssetId(assetId: string): Promise<MaintenanceSchedule[]> {
    const raws = await this.prisma.maintenanceSchedule.findMany({
      where: { assetId },
      orderBy: { scheduledDate: 'desc' },
    });
    return raws.map((r) => MaintenanceScheduleMapper.toDomain(r));
  }

  async findAll(
    organizationId: string,
    options?: {
      assetId?: string;
      status?: MaintenanceStatus | MaintenanceStatus[];
      maintenanceType?: MaintenanceType | MaintenanceType[];
      startDate?: Date;
      endDate?: Date;
      performedByUserId?: string;
      search?: string;
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
    },
  ): Promise<{ data: MaintenanceSchedule[]; total: number }> {
    const where: Prisma.MaintenanceScheduleWhereInput = { organizationId };

    if (options?.assetId) where.assetId = options.assetId;
    if (options?.status) {
      where.status = Array.isArray(options.status)
        ? { in: options.status }
        : options.status;
    }
    if (options?.maintenanceType) {
      where.maintenanceType = Array.isArray(options.maintenanceType)
        ? { in: options.maintenanceType }
        : options.maintenanceType;
    }
    if (options?.startDate && options?.endDate) {
      where.scheduledDate = { gte: options.startDate, lte: options.endDate };
    }
    if (options?.performedByUserId)
      where.performedByUserId = options.performedByUserId;
    if (options?.search) {
      where.description = { contains: options.search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.maintenanceSchedule.findMany({
        where,
        take: options?.limit,
        skip: options?.offset,
        orderBy: { scheduledDate: 'desc' },
      }),
      this.prisma.maintenanceSchedule.count({ where }),
    ]);

    return {
      data: data.map((r) => MaintenanceScheduleMapper.toDomain(r)),
      total,
    };
  }

  async findUpcoming(
    organizationId: string,
    daysAhead: number,
  ): Promise<MaintenanceSchedule[]> {
    const now = new Date();
    const futureDate = new Date(
      now.getTime() + daysAhead * 24 * 60 * 60 * 1000,
    );
    const raws = await this.prisma.maintenanceSchedule.findMany({
      where: {
        organizationId,
        scheduledDate: { gte: now, lte: futureDate },
        status: MaintenanceStatus.SCHEDULED,
      },
      orderBy: { scheduledDate: 'asc' },
    });
    return raws.map((r) => MaintenanceScheduleMapper.toDomain(r));
  }

  async findOverdue(organizationId: string): Promise<MaintenanceSchedule[]> {
    const now = new Date();
    const raws = await this.prisma.maintenanceSchedule.findMany({
      where: {
        organizationId,
        scheduledDate: { lt: now },
        status: {
          in: [MaintenanceStatus.SCHEDULED, MaintenanceStatus.APPROVED],
        },
      },
      orderBy: { scheduledDate: 'asc' },
    });
    return raws.map((r) => MaintenanceScheduleMapper.toDomain(r));
  }

  async findByStatus(
    organizationId: string,
    status: MaintenanceStatus,
  ): Promise<MaintenanceSchedule[]> {
    const raws = await this.prisma.maintenanceSchedule.findMany({
      where: { organizationId, status },
      orderBy: { scheduledDate: 'desc' },
    });
    return raws.map((r) => MaintenanceScheduleMapper.toDomain(r));
  }

  async findByType(
    organizationId: string,
    maintenanceType: MaintenanceType,
  ): Promise<MaintenanceSchedule[]> {
    const raws = await this.prisma.maintenanceSchedule.findMany({
      where: { organizationId, maintenanceType },
      orderBy: { scheduledDate: 'desc' },
    });
    return raws.map((r) => MaintenanceScheduleMapper.toDomain(r));
  }

  async findByPerformer(
    performedByUserId: string,
  ): Promise<MaintenanceSchedule[]> {
    const raws = await this.prisma.maintenanceSchedule.findMany({
      where: { performedByUserId },
      orderBy: { scheduledDate: 'desc' },
    });
    return raws.map((r) => MaintenanceScheduleMapper.toDomain(r));
  }

  async findCompletedInPeriod(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<MaintenanceSchedule[]> {
    const raws = await this.prisma.maintenanceSchedule.findMany({
      where: {
        organizationId,
        status: MaintenanceStatus.COMPLETED,
        actualDate: { gte: startDate, lte: endDate },
      },
      orderBy: { actualDate: 'desc' },
    });
    return raws.map((r) => MaintenanceScheduleMapper.toDomain(r));
  }

  async hasActiveMaintenance(assetId: string): Promise<boolean> {
    const count = await this.prisma.maintenanceSchedule.count({
      where: {
        assetId,
        status: {
          in: [
            MaintenanceStatus.SCHEDULED,
            MaintenanceStatus.IN_PROGRESS,
            MaintenanceStatus.APPROVED,
          ],
        },
      },
    });
    return count > 0;
  }

  async hasScheduledMaintenance(assetId: string, date: Date): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const count = await this.prisma.maintenanceSchedule.count({
      where: {
        assetId,
        scheduledDate: { gte: startOfDay, lte: endOfDay },
        status: MaintenanceStatus.SCHEDULED,
      },
    });
    return count > 0;
  }

  async existsById(maintenanceId: string): Promise<boolean> {
    const count = await this.prisma.maintenanceSchedule.count({
      where: { id: maintenanceId },
    });
    return count > 0;
  }

  async save(maintenance: MaintenanceSchedule): Promise<MaintenanceSchedule> {
    const { data } = MaintenanceScheduleMapper.toPersistence(maintenance);
    const raw = await this.prisma.maintenanceSchedule.create({ data });
    return MaintenanceScheduleMapper.toDomain(raw);
  }

  async update(maintenance: MaintenanceSchedule): Promise<MaintenanceSchedule> {
    const { data } = MaintenanceScheduleMapper.toPersistence(maintenance);
    const raw = await this.prisma.maintenanceSchedule.update({
      where: { id: maintenance.id },
      data,
    });
    return MaintenanceScheduleMapper.toDomain(raw);
  }

  async saveMany(maintenances: MaintenanceSchedule[]): Promise<void> {
    const data = maintenances.map(
      (m) => MaintenanceScheduleMapper.toPersistence(m).data,
    );
    await this.prisma.$transaction(
      data.map((d) => this.prisma.maintenanceSchedule.create({ data: d })),
    );
  }

  async delete(maintenanceId: string): Promise<void> {
    await this.prisma.maintenanceSchedule.delete({
      where: { id: maintenanceId },
    });
  }

  async deleteMany(maintenanceIds: string[]): Promise<void> {
    await this.prisma.maintenanceSchedule.deleteMany({
      where: { id: { in: maintenanceIds } },
    });
  }

  async hardDelete(maintenanceId: string): Promise<void> {
    await this.prisma.maintenanceSchedule.delete({
      where: { id: maintenanceId },
    });
  }

  async hardDeleteMany(maintenanceIds: string[]): Promise<void> {
    await this.prisma.maintenanceSchedule.deleteMany({
      where: { id: { in: maintenanceIds } },
    });
  }

  async restore(maintenanceId: string): Promise<void> {
    // No soft delete implemented for this model
  }

  async restoreMany(maintenanceIds: string[]): Promise<void> {
    // No soft delete implemented for this model
  }

  async getMaintenanceSummary(organizationId: string): Promise<{
    totalCount: number;
    byStatus: Record<MaintenanceStatus, number>;
    byType: Record<MaintenanceType, number>;
    upcomingCount: number;
    overdueCount: number;
    totalEstimatedCost: number;
    totalActualCost: number;
  }> {
    const maintenances = await this.prisma.maintenanceSchedule.findMany({
      where: { organizationId },
      select: {
        status: true,
        maintenanceType: true,
        estimatedCost: true,
        actualCost: true,
        scheduledDate: true,
      },
    });

    const now = new Date();
    const result = {
      totalCount: maintenances.length,
      byStatus: {} as Record<MaintenanceStatus, number>,
      byType: {} as Record<MaintenanceType, number>,
      upcomingCount: 0,
      overdueCount: 0,
      totalEstimatedCost: 0,
      totalActualCost: 0,
    };

    Object.values(MaintenanceStatus).forEach((s) => (result.byStatus[s] = 0));
    Object.values(MaintenanceType).forEach((t) => (result.byType[t] = 0));

    for (const m of maintenances) {
      result.byStatus[m.status as MaintenanceStatus]++;
      result.byType[m.maintenanceType as MaintenanceType]++;
      result.totalEstimatedCost += m.estimatedCost
        ? Number(m.estimatedCost)
        : 0;
      result.totalActualCost += m.actualCost ? Number(m.actualCost) : 0;

      if (m.scheduledDate > now && m.status === MaintenanceStatus.SCHEDULED) {
        result.upcomingCount++;
      }
      if (
        m.scheduledDate < now &&
        [MaintenanceStatus.SCHEDULED, MaintenanceStatus.APPROVED].includes(
          m.status as MaintenanceStatus,
        )
      ) {
        result.overdueCount++;
      }
    }

    return result;
  }

  async getAssetMaintenanceHistory(
    assetId: string,
  ): Promise<MaintenanceSchedule[]> {
    return this.findByAssetId(assetId);
  }

  async getMaintenanceCostAnalysis(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalCost: number;
    byType: Record<MaintenanceType, number>;
    byAsset: Record<string, number>;
    monthlyTrends: Array<{ month: string; cost: number; count: number }>;
  }> {
    const maintenances = await this.prisma.maintenanceSchedule.findMany({
      where: {
        organizationId,
        actualDate: { gte: startDate, lte: endDate },
        status: MaintenanceStatus.COMPLETED,
      },
      select: {
        maintenanceType: true,
        assetId: true,
        actualCost: true,
        actualDate: true,
      },
    });

    const result = {
      totalCost: 0,
      byType: {} as Record<MaintenanceType, number>,
      byAsset: {} as Record<string, number>,
      monthlyTrends: [] as Array<{
        month: string;
        cost: number;
        count: number;
      }>,
    };

    Object.values(MaintenanceType).forEach((t) => (result.byType[t] = 0));
    const monthlyMap = new Map<string, { cost: number; count: number }>();

    for (const m of maintenances) {
      const cost = m.actualCost ? Number(m.actualCost) : 0;
      result.totalCost += cost;
      result.byType[m.maintenanceType as MaintenanceType] += cost;
      result.byAsset[m.assetId] = (result.byAsset[m.assetId] || 0) + cost;

      if (m.actualDate) {
        const monthKey = `${m.actualDate.getFullYear()}-${String(m.actualDate.getMonth() + 1).padStart(2, '0')}`;
        const existing = monthlyMap.get(monthKey) || { cost: 0, count: 0 };
        monthlyMap.set(monthKey, {
          cost: existing.cost + cost,
          count: existing.count + 1,
        });
      }
    }

    result.monthlyTrends = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return result;
  }

  async findMaintenanceDueForReview(
    organizationId: string,
    daysThreshold: number,
  ): Promise<MaintenanceSchedule[]> {
    return this.findUpcoming(organizationId, daysThreshold);
  }

  async getMaintenanceFrequencyReport(
    organizationId: string,
    period: 'month' | 'quarter' | 'year',
  ): Promise<{
    period: string;
    totalMaintenances: number;
    byType: Record<MaintenanceType, number>;
    avgCompletionTime: number;
    mostCommonIssues: Array<{ issue: string; count: number }>;
  }> {
    // Simplified implementation
    const summary = await this.getMaintenanceSummary(organizationId);
    return {
      period,
      totalMaintenances: summary.totalCount,
      byType: summary.byType,
      avgCompletionTime: 0,
      mostCommonIssues: [],
    };
  }

  async getMaintenanceBacklog(organizationId: string): Promise<{
    scheduled: number;
    inProgress: number;
    pendingApproval: number;
    overdue: number;
  }> {
    const summary = await this.getMaintenanceSummary(organizationId);
    return {
      scheduled: summary.byStatus[MaintenanceStatus.SCHEDULED] || 0,
      inProgress: summary.byStatus[MaintenanceStatus.IN_PROGRESS] || 0,
      pendingApproval:
        summary.byStatus[MaintenanceStatus.PENDING_APPROVAL] || 0,
      overdue: summary.overdueCount,
    };
  }

  async findHighCostMaintenances(
    organizationId: string,
    threshold: number,
  ): Promise<MaintenanceSchedule[]> {
    const raws = await this.prisma.maintenanceSchedule.findMany({
      where: {
        organizationId,
        actualCost: { gte: threshold },
      },
      orderBy: { actualCost: 'desc' },
    });
    return raws.map((r) => MaintenanceScheduleMapper.toDomain(r));
  }

  async getMaintenanceEfficiencyMetrics(organizationId: string): Promise<{
    completionRate: number;
    averageDelay: number;
    onTimeCompletionRate: number;
    costVariance: number;
  }> {
    // Simplified implementation
    return {
      completionRate: 0,
      averageDelay: 0,
      onTimeCompletionRate: 0,
      costVariance: 0,
    };
  }

  async getTechnicianPerformanceReport(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<{
      userId: string;
      completedCount: number;
      inProgressCount: number;
      totalCost: number;
      averageCompletionTime: number;
      onTimeRate: number;
    }>
  > {
    // Simplified implementation
    return [];
  }

  async findRecurringIssues(
    organizationId: string,
    lookbackDays: number,
  ): Promise<
    Array<{
      assetId: string;
      issuePattern: string;
      occurrenceCount: number;
      lastOccurrence: Date;
    }>
  > {
    // Simplified implementation
    return [];
  }

  async exportMaintenanceReport(
    organizationId: string,
    options: {
      startDate: Date;
      endDate: Date;
      format: 'CSV' | 'JSON' | 'PDF';
    },
  ): Promise<string> {
    // Simplified implementation
    return '';
  }
}
