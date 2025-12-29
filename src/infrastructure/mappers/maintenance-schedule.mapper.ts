import {
    MaintenanceSchedule,
    MaintenanceStatus,
    MaintenanceType,
} from 'src/domain/maintenance/maintenance-schedule';
import { MaintenanceSchedule as PrismaMaintenanceSchedule, Prisma } from 'generated/prisma/client';

export class MaintenanceScheduleMapper {
    static toDomain(raw: PrismaMaintenanceSchedule): MaintenanceSchedule {
        const builder = MaintenanceSchedule.builder(
            raw.id,
            raw.assetId,
            raw.organizationId,
            raw.maintenanceType as MaintenanceType,
            raw.scheduledDate,
        )
            .withActualDate(raw.actualDate)
            .withStatus(raw.status as MaintenanceStatus)
            .withDescription(raw.description)
            .withEstimatedCost(raw.estimatedCost ? Number(raw.estimatedCost) : null)
            .withActualCost(raw.actualCost ? Number(raw.actualCost) : null)
            .withPerformedByUserId(raw.performedByUserId)
            .withResult(raw.result)
            .withTimestamps(raw.createdAt, raw.updatedAt);

        return MaintenanceSchedule.createFromBuilder(builder);
    }

    static toPersistence(domain: MaintenanceSchedule): {
        data: Omit<PrismaMaintenanceSchedule, 'createdAt' | 'updatedAt'>;
    } {
        return {
            data: {
                id: domain.id,
                assetId: domain.assetId,
                organizationId: domain.organizationId,
                maintenanceType: domain.maintenanceType,
                scheduledDate: domain.scheduledDate,
                actualDate: domain.actualDate,
                status: domain.status,
                description: domain.description,
                estimatedCost: domain.estimatedCost !== null ? new Prisma.Decimal(domain.estimatedCost) : null,
                actualCost: domain.actualCost !== null ? new Prisma.Decimal(domain.actualCost) : null,
                performedByUserId: domain.performedByUserId,
                result: domain.result,
            },
        };
    }
}
