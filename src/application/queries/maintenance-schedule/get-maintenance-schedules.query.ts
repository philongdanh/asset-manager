import { MaintenanceStatus, MaintenanceType } from 'src/domain/maintenance/maintenance-schedule';

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
    ) { }
}
