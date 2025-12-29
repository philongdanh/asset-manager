import { Injectable, Inject } from '@nestjs/common';
import {
  MAINTENANCE_SCHEDULE_REPOSITORY,
  type IMaintenanceScheduleRepository,
  MaintenanceSchedule,
} from '../../../domain';
import { GetMaintenanceSchedulesQuery } from './get-maintenance-schedules.query';

@Injectable()
export class GetMaintenanceSchedulesHandler {
  constructor(
    @Inject(MAINTENANCE_SCHEDULE_REPOSITORY)
    private readonly maintenanceRepo: IMaintenanceScheduleRepository,
  ) {}

  async execute(
    query: GetMaintenanceSchedulesQuery,
  ): Promise<{ data: MaintenanceSchedule[]; total: number }> {
    return await this.maintenanceRepo.findAll(
      query.organizationId,
      query.options,
    );
  }
}
