import { AuditAction, EntityType } from 'src/domain/inventory-audit/audit-log';

export class CreateAuditLogCommand {
  constructor(
    public readonly organizationId: string,
    public readonly userId: string,
    public readonly action: AuditAction,
    public readonly entityType: EntityType,
    public readonly entityId: string,
    public readonly oldValue?: Record<string, any>,
    public readonly newValue?: Record<string, any>,
    public readonly ipAddress?: string,
  ) {}
}
