import { MaintenanceStatus, MaintenanceType } from '../../../domain';

export class GetMaintenanceSchedulesQuery {
  constructor(
    public readonly organizationId: string,
    public readonly options?: {
      assetId?: string;
      status?: MaintenanceStatus;
      maintenanceType?: MaintenanceType;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    },
  ) {}
}
