import { Prisma, AuditLog as PrismaAuditLog } from 'generated/prisma/client';
import {
    AuditLog,
    AuditAction,
    EntityType,
} from 'src/modules/audit-log/domain';

export class AuditLogMapper {
    static toDomain(raw: PrismaAuditLog): AuditLog {
        const builder = AuditLog.builder(
            raw.id,
            raw.organizationId,
            raw.userId,
            raw.action as AuditAction,
            raw.entityType as EntityType,
            raw.entityId,
        );

        builder.withChanges(
            raw.oldValue ? JSON.parse(raw.oldValue) : null,
            raw.newValue ? JSON.parse(raw.newValue) : null,
        );
        builder.withIpAddress(raw.ipAddress);
        builder.withActionTime(raw.actionTime);
        builder.withTimestamps(raw.actionTime, raw.actionTime, null);

        return builder.build();
    }

    static toPersistence(log: AuditLog): Prisma.AuditLogCreateArgs {
        return {
            data: {
                id: log.id,
                organizationId: log.organizationId,
                userId: log.userId,
                action: log.action,
                entityType: log.entityType,
                entityId: log.entityId,
                oldValue: log.oldValue,
                newValue: log.newValue,
                actionTime: log.actionTime,
                ipAddress: log.ipAddress,
            },
        };
    }
}
