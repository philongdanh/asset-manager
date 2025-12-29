import { Expose } from 'class-transformer';

export class AuditLogResponse {
  @Expose()
  id: string;

  @Expose({ name: 'organization_id' })
  organizationId: string;

  @Expose({ name: 'user_id' })
  userId: string;

  @Expose()
  action: string;

  @Expose({ name: 'entity_type' })
  entityType: string;

  @Expose({ name: 'entity_id' })
  entityId: string;

  @Expose({ name: 'old_value' })
  oldValue: string | null;

  @Expose({ name: 'new_value' })
  newValue: string | null;

  @Expose({ name: 'action_time' })
  actionTime: Date;

  @Expose({ name: 'ip_address' })
  ipAddress: string | null;
}
