import { Expose } from 'class-transformer';
import { AuditAction, EntityType } from 'src/domain/inventory-audit/audit-log';

export class AuditLogResponse {
    @Expose()
    id: string;

    @Expose()
    organization_id: string;

    @Expose()
    user_id: string;

    @Expose()
    action: AuditAction;

    @Expose()
    entity_type: EntityType;

    @Expose()
    entity_id: string;

    @Expose()
    old_value: string | null;

    @Expose()
    new_value: string | null;

    @Expose()
    action_time: Date;

    @Expose()
    ip_address: string | null;
}
