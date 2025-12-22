import { MaintenanceSchedule } from './maintenance-schedule.entity';

export const MAINTENANCE_SCHEDULE_REPOSITORY = Symbol(
  'MAINTENANCE_SCHEDULE_REPOSITORY',
);

export interface IMaintenanceScheduleRepository {
  // --- Query Methods ---

  findById(id: string): Promise<MaintenanceSchedule | null>;

  findByAssetId(assetId: string): Promise<MaintenanceSchedule[]>;

  findAll(
    organizationId: string,
    options?: {
      status?: string; // e.g., 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'
      maintenanceType?: string; // e.g., 'PREVENTIVE', 'CORRECTIVE'
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: MaintenanceSchedule[]; total: number }>;

  findUpcoming(
    organizationId: string,
    untilDate: Date,
  ): Promise<MaintenanceSchedule[]>;

  findByVendor(
    organizationId: string,
    vendorName: string,
  ): Promise<MaintenanceSchedule[]>;

  // --- Validation Methods ---

  hasActiveMaintenance(assetId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(schedule: MaintenanceSchedule): Promise<MaintenanceSchedule>;

  delete(id: string): Promise<void>;
}
