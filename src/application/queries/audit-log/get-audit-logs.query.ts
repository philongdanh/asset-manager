import { AuditAction, EntityType } from 'src/domain/inventory-audit/audit-log';

export class GetAuditLogsQuery {
  constructor(
    public readonly organizationId: string,
    public readonly options: {
      userId?: string;
      action?: AuditAction;
      entityType?: EntityType;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {},
  ) {}
}
