import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import {
  IAuditLogRepository,
  AuditLog,
  AuditAction,
  EntityType,
} from 'src/modules/audit-log/domain';
import { AuditLogMapper } from '../mappers/audit-log.mapper';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(logId: string): Promise<AuditLog | null> {
    const raw = await this.prisma.auditLog.findUnique({ where: { id: logId } });
    return raw ? AuditLogMapper.toDomain(raw) : null;
  }

  async findByEntity(
    entityType: EntityType,
    entityId: string,
  ): Promise<AuditLog[]> {
    const raws = await this.prisma.auditLog.findMany({
      where: { entityType: entityType as string, entityId },
      orderBy: { actionTime: 'desc' },
    });
    return raws.map(AuditLogMapper.toDomain);
  }

  async findByEntityHistory(
    entityType: EntityType,
    entityId: string,
    options?: {
      action?: AuditAction;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: AuditLog[]; total: number }> {
    const where: Prisma.AuditLogWhereInput = {
      entityType: entityType as string,
      entityId,
    };
    if (options?.action) where.action = options.action as string;
    if (options?.startDate || options?.endDate) {
      where.actionTime = {};
      if (options.startDate) where.actionTime.gte = options.startDate;
      if (options.endDate) where.actionTime.lte = options.endDate;
    }

    const [raws, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { actionTime: 'desc' },
        take: options?.limit,
        skip: options?.offset,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: raws.map(AuditLogMapper.toDomain),
      total,
    };
  }

  async findAll(
    organizationId: string,
    options?: {
      userId?: string;
      action?: AuditAction | AuditAction[];
      entityType?: EntityType | EntityType[];
      startDate?: Date;
      endDate?: Date;
      search?: string;
      ipAddress?: string;
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
    },
  ): Promise<{ data: AuditLog[]; total: number }> {
    const where: Prisma.AuditLogWhereInput = { organizationId };

    if (options?.userId) where.userId = options.userId;
    if (options?.action) {
      where.action = Array.isArray(options.action)
        ? { in: options.action as string[] }
        : (options.action as string);
    }
    if (options?.entityType) {
      where.entityType = Array.isArray(options.entityType)
        ? { in: options.entityType as string[] }
        : (options.entityType as string);
    }
    if (options?.startDate || options?.endDate) {
      where.actionTime = {};
      if (options.startDate) where.actionTime.gte = options.startDate;
      if (options.endDate) where.actionTime.lte = options.endDate;
    }
    if (options?.ipAddress) where.ipAddress = options.ipAddress;

    const [raws, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { actionTime: 'desc' },
        take: options?.limit,
        skip: options?.offset,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: raws.map(AuditLogMapper.toDomain),
      total,
    };
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    const raws = await this.prisma.auditLog.findMany({ where: { userId } });
    return raws.map(AuditLogMapper.toDomain);
  }

  async findByAction(action: AuditAction): Promise<AuditLog[]> {
    const raws = await this.prisma.auditLog.findMany({
      where: { action: action as string },
    });
    return raws.map(AuditLogMapper.toDomain);
  }

  async findByEntityType(entityType: EntityType): Promise<AuditLog[]> {
    const raws = await this.prisma.auditLog.findMany({
      where: { entityType: entityType as string },
    });
    return raws.map(AuditLogMapper.toDomain);
  }

  async findByIpAddress(ipAddress: string): Promise<AuditLog[]> {
    const raws = await this.prisma.auditLog.findMany({ where: { ipAddress } });
    return raws.map(AuditLogMapper.toDomain);
  }

  async existsById(logId: string): Promise<boolean> {
    const count = await this.prisma.auditLog.count({ where: { id: logId } });
    return count > 0;
  }

  async save(log: AuditLog): Promise<AuditLog> {
    const { data } = AuditLogMapper.toPersistence(log);
    const raw = await this.prisma.auditLog.upsert({
      where: { id: log.id },
      update: {
        ...data,
      },
      create: data,
    });
    return AuditLogMapper.toDomain(raw);
  }

  async saveMany(logs: AuditLog[]): Promise<void> {
    if (logs.length === 0) return;
    const data: Prisma.AuditLogCreateManyInput[] = logs.map((l) => ({
      id: l.id,
      organizationId: l.organizationId,
      userId: l.userId,
      action: l.action,
      entityType: l.entityType,
      entityId: l.entityId,
      oldValue: l.oldValue,
      newValue: l.newValue,
      actionTime: l.actionTime,
      ipAddress: l.ipAddress,
    }));
    await this.prisma.auditLog.createMany({ data });
  }

  async delete(logId: string): Promise<void> {
    await this.prisma.auditLog.delete({ where: { id: logId } });
  }

  async deleteMany(logIds: string[]): Promise<void> {
    await this.prisma.auditLog.deleteMany({ where: { id: { in: logIds } } });
  }

  async getAuditSummary(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        organizationId,
        actionTime: { gte: startDate, lte: endDate },
      },
    });

    const byAction: Record<string, number> = {};
    const byEntityType: Record<string, number> = {};
    const byUser: Record<string, number> = {};
    const dailyCountsMap: Record<string, number> = {};

    for (const log of logs) {
      byAction[log.action] = (byAction[log.action] || 0) + 1;
      byEntityType[log.entityType] = (byEntityType[log.entityType] || 0) + 1;
      byUser[log.userId] = (byUser[log.userId] || 0) + 1;
      const date = log.actionTime.toISOString().split('T')[0];
      dailyCountsMap[date] = (dailyCountsMap[date] || 0) + 1;
    }

    return {
      totalLogs: logs.length,
      byAction,
      byEntityType,
      byUser,
      dailyCounts: Object.entries(dailyCountsMap).map(([date, count]) => ({
        date,
        count,
      })),
    };
  }

  async getEntityAuditTrail(
    entityType: EntityType,
    entityId: string,
  ): Promise<AuditLog[]> {
    return this.findByEntity(entityType, entityId);
  }

  async getUserActivityReport(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const logs = await this.prisma.auditLog.findMany({
      where: { userId, actionTime: { gte: startDate, lte: endDate } },
      orderBy: { actionTime: 'desc' },
    });

    const actionsByType: Record<string, number> = {};
    const entitiesModified: Record<string, number> = {};
    const hoursMap: Record<number, number> = {};

    for (const log of logs) {
      actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;
      entitiesModified[log.entityType] =
        (entitiesModified[log.entityType] || 0) + 1;
      const h = log.actionTime.getHours();
      hoursMap[h] = (hoursMap[h] || 0) + 1;
    }

    return {
      totalActions: logs.length,
      actionsByType,
      entitiesModified,
      peakActivityHours: Object.entries(hoursMap).map(([h, c]) => ({
        hour: +h,
        count: c,
      })),
      recentActions: logs.slice(0, 50).map(AuditLogMapper.toDomain),
    };
  }

  async findRecentLogs(
    organizationId: string,
    limit: number,
  ): Promise<AuditLog[]> {
    const raws = await this.prisma.auditLog.findMany({
      where: { organizationId },
      orderBy: { actionTime: 'desc' },
      take: limit,
    });
    return raws.map(AuditLogMapper.toDomain);
  }

  async findSuspiciousActivities(
    _organizationId: string,
    _options?: any,
  ): Promise<any> {
    return { highFrequencyIPs: [], unusualHours: [], massDeletions: [] };
  }

  async cleanupOldLogs(retentionDays: number): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - retentionDays);
    const res = await this.prisma.auditLog.deleteMany({
      where: { actionTime: { lt: date } },
    });
    return res.count;
  }

  async exportAuditLogs(
    _organizationId: string,
    _options: any,
  ): Promise<string> {
    return '';
  }

  async logSearch(
    _organizationId: string,
    _criteria: any,
  ): Promise<AuditLog[]> {
    return [];
  }

  async getLogStatistics(_organizationId: string, _period: any): Promise<any> {
    return {};
  }
}
