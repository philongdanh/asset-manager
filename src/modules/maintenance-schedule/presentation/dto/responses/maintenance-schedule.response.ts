import { Exclude, Expose } from 'class-transformer';
import {
  MaintenanceSchedule,
  MaintenanceStatus,
  MaintenanceType,
} from '../../../domain';
import type { MaintenanceScheduleResult } from '../../../application/dtos/maintenance-schedule.result';

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

  @Expose()
  asset: any | null;

  @Expose()
  organization: any | null;

  @Expose({ name: 'performed_by_user' })
  performedByUser: any | null;

  constructor(result: MaintenanceScheduleResult) {
    const { maintenance, asset, organization, performedByUser } = result;

    this.id = maintenance.id;
    this.assetId = maintenance.assetId;
    this.organizationId = maintenance.organizationId;
    this.maintenanceType = maintenance.maintenanceType;
    this.scheduledDate = maintenance.scheduledDate;
    this.actualDate = maintenance.actualDate;
    this.status = maintenance.status;
    this.description = maintenance.description;
    this.estimatedCost = maintenance.estimatedCost;
    this.actualCost = maintenance.actualCost;
    this.performedByUserId = maintenance.performedByUserId;
    this.result = maintenance.result;
    this.createdAt = maintenance.createdAt!;
    this.updatedAt = maintenance.updatedAt!;

    this.asset = asset
      ? {
          id: asset.id,
          asset_code: asset.assetCode,
          asset_name: asset.assetName,
        }
      : null;

    this.organization = organization
      ? { id: organization.id, name: organization.name }
      : null;

    this.performedByUser = performedByUser
      ? {
          id: performedByUser.id,
          username: performedByUser.username,
          email: performedByUser.email,
        }
      : null;
  }
}
