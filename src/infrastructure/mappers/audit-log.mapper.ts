import { Prisma, AuditLog as PrismaAuditLog } from 'generated/prisma/client';
import {
  AuditLog,
  AuditAction,
  EntityType,
} from 'src/domain/inventory-audit/audit-log';

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

    // Entity extends BaseEntity but Prisma doesn't have created/updated fields mapped automatically to Entity props via builder?
    // BaseEntity needs timestamps. AuditLog builder has withTimestamps.
    // Schema has no createdAt/updatedAt/deletedAt for AuditLog?
    // Schema lines 366-383: it DOES NOT have createdAt/updatedAt columns explicitly named `createdAt`?
    // Wait, let's check schema again.
    // Line 375: `actionTime DateTime @default(now()) @map("action_time")`.
    // No `createdAt` column separate from `actionTime`?
    // Line 366.
    // Checking schema ...
    // Ah, schema lines 366-383. NO `createdAt`!
    // Just `actionTime`.
    // But Domain Entity extends `BaseEntity` which has `createdAt`, `updatedAt`, `deletedAt`.
    // This is a mismatch.
    // `AuditLog` in domain assumes it's an entity with lifecycle.
    // DB assumes it's a log with timestamp.
    // I will map `actionTime` to `createdAt` and `updatedAt`?
    // Or just pass current date if missing.
    // I'll use `actionTime` for all.

    // Actually, builder defaults them to new Date().
    // I'll set them to actionTime.

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
