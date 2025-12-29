import { MaintenanceType } from 'src/domain/maintenance/maintenance-schedule';

export class CreateMaintenanceScheduleCommand {
  constructor(
    public readonly assetId: string,
    public readonly organizationId: string,
    public readonly maintenanceType: MaintenanceType,
    public readonly scheduledDate: Date,
    public readonly description: string | null,
    public readonly estimatedCost: number | null,
  ) {}
}
