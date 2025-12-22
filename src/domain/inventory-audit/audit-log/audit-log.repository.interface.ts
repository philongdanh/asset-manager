import { AuditLog } from './audit-log.entity';

export const AUDIT_LOG_REPOSITORY = Symbol('AUDIT_LOG_REPOSITORY');

export interface IAuditLogRepository {
  // --- Query Methods ---

  findById(id: string): Promise<AuditLog | null>;

  findByEntity(entityName: string, entityId: string): Promise<AuditLog[]>;

  findAll(
    organizationId: string,
    options?: {
      userId?: string;
      action?: string; // e.g., 'CREATE', 'UPDATE', 'DELETE'
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: AuditLog[]; total: number }>;

  findByUser(userId: string): Promise<AuditLog[]>;

  // --- Persistence Methods ---

  save(log: AuditLog): Promise<AuditLog>;

  saveMany(logs: AuditLog[]): Promise<void>;

  deleteOlderThan(date: Date): Promise<void>;
}
