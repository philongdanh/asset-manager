import { Exclude, Expose } from 'class-transformer';
import { MaintenanceSchedule, MaintenanceStatus, MaintenanceType } from '../../../domain';

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

  constructor(entity: MaintenanceSchedule) {
    this.id = entity.id;
    this.assetId = entity.assetId;
    this.organizationId = entity.organizationId;
    this.maintenanceType = entity.maintenanceType;
    this.scheduledDate = entity.scheduledDate;
    this.actualDate = entity.actualDate;
    this.status = entity.status;
    this.description = entity.description;
    this.estimatedCost = entity.estimatedCost;
    this.actualCost = entity.actualCost;
    this.performedByUserId = entity.performedByUserId;
    this.result = entity.result;
    this.createdAt = entity.createdAt!;
    this.updatedAt = entity.updatedAt!;
  }
}
