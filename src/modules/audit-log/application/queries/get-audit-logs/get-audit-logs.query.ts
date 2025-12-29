import { AuditAction, EntityType } from '../../../domain';

export class GetAuditLogsQuery {
  constructor(
    public readonly organizationId: string,
    public readonly options: {
      userId?: string;
      action?: AuditAction | AuditAction[];
      entityType?: EntityType | EntityType[];
      startDate?: Date;
      endDate?: Date;
      search?: string;
      ipAddress?: string;
      limit?: number;
      offset?: number;
    } = {},
  ) {}
}
