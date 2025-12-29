import { AuditLog, AuditAction, EntityType } from './audit-log.entity';

export const AUDIT_LOG_REPOSITORY = Symbol('AUDIT_LOG_REPOSITORY');

export interface IAuditLogRepository {
  // --- Query Methods ---

  findById(logId: string): Promise<AuditLog | null>;

  findByEntity(entityType: EntityType, entityId: string): Promise<AuditLog[]>;

  findByEntityHistory(
    entityType: EntityType,
    entityId: string,
    options?: {
      action?: AuditAction;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: AuditLog[]; total: number }>;

  findAll(
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
  ): Promise<{ data: AuditLog[]; total: number }>;

  findByUser(userId: string): Promise<AuditLog[]>;

  findByAction(action: AuditAction): Promise<AuditLog[]>;

  findByEntityType(entityType: EntityType): Promise<AuditLog[]>;

  findByIpAddress(ipAddress: string): Promise<AuditLog[]>;

  // --- Validation Methods ---

  existsById(logId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(log: AuditLog): Promise<AuditLog>;

  saveMany(logs: AuditLog[]): Promise<void>;

  delete(logId: string): Promise<void>;

  deleteMany(logIds: string[]): Promise<void>;

  // --- Special Methods ---

  getAuditSummary(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalLogs: number;
    byAction: Record<AuditAction, number>;
    byEntityType: Record<EntityType, number>;
    byUser: Record<string, number>;
    dailyCounts: Array<{ date: string; count: number }>;
  }>;

  getEntityAuditTrail(
    entityType: EntityType,
    entityId: string,
  ): Promise<AuditLog[]>;

  getUserActivityReport(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalActions: number;
    actionsByType: Record<AuditAction, number>;
    entitiesModified: Record<EntityType, number>;
    peakActivityHours: Array<{ hour: number; count: number }>;
    recentActions: AuditLog[];
  }>;

  findRecentLogs(organizationId: string, limit: number): Promise<AuditLog[]>;

  findSuspiciousActivities(
    organizationId: string,
    options?: {
      threshold?: number;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<{
    highFrequencyIPs: Array<{ ipAddress: string; count: number }>;
    unusualHours: Array<{ userId: string; action: string; time: Date }>;
    massDeletions: Array<{ userId: string; entityType: string; count: number }>;
  }>;

  cleanupOldLogs(retentionDays: number): Promise<number>;

  exportAuditLogs(
    organizationId: string,
    options: {
      startDate: Date;
      endDate: Date;
      format: 'CSV' | 'JSON';
    },
  ): Promise<string>;

  logSearch(
    organizationId: string,
    searchCriteria: {
      field: 'userId' | 'entityId' | 'ipAddress' | 'action' | 'entityType';
      value: string;
    },
  ): Promise<AuditLog[]>;

  getLogStatistics(
    organizationId: string,
    period: 'day' | 'week' | 'month' | 'year',
  ): Promise<{
    period: string;
    totalLogs: number;
    avgLogsPerDay: number;
    topUsers: Array<{ userId: string; count: number }>;
    topEntities: Array<{ entityType: string; count: number }>;
  }>;
}
