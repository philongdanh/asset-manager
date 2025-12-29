import { Exclude, Expose } from 'class-transformer';
import { MaintenanceStatus, MaintenanceType } from 'src/domain/maintenance/maintenance-schedule';

@Exclude()
export class MaintenanceScheduleResponse {
    @Expose()
    id: string;

    @Expose({ name: 'asset_id' })
    assetId: string;

    @Expose({ name: 'organization_id' })
    organizationId: string;

    @Expose({ name: 'maintenance_type' })
    maintenanceType: MaintenanceType;

    @Expose({ name: 'scheduled_date' })
    scheduledDate: Date;

    @Expose({ name: 'actual_date' })
    actualDate: Date | null;

    @Expose()
    status: MaintenanceStatus;

    @Expose()
    description: string | null;

    @Expose({ name: 'estimated_cost' })
    estimatedCost: number | null;

    @Expose({ name: 'actual_cost' })
    actualCost: number | null;

    @Expose({ name: 'performed_by_user_id' })
    performedByUserId: string | null;

    @Expose()
    result: string | null;

    @Expose({ name: 'created_at' })
    createdAt: Date;

    @Expose({ name: 'updated_at' })
    updatedAt: Date;

    constructor(partial: Partial<MaintenanceScheduleResponse>) {
        Object.assign(this, partial);
    }
}
