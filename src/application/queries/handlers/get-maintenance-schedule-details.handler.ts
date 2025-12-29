import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  MAINTENANCE_SCHEDULE_REPOSITORY,
  type IMaintenanceScheduleRepository,
  MaintenanceSchedule,
} from 'src/domain/maintenance/maintenance-schedule';
import { GetMaintenanceScheduleByIdQuery } from '../maintenance-schedule/get-maintenance-schedule-by-id.query';

@Injectable()
export class GetMaintenanceScheduleDetailsHandler {
  constructor(
    @Inject(MAINTENANCE_SCHEDULE_REPOSITORY)
    private readonly maintenanceRepo: IMaintenanceScheduleRepository,
  ) {}

  async execute(
    query: GetMaintenanceScheduleByIdQuery,
  ): Promise<MaintenanceSchedule> {
    const maintenance = await this.maintenanceRepo.findById(query.id);
    if (!maintenance) {
      throw new UseCaseException(
        `Maintenance schedule with id ${query.id} not found`,
        GetMaintenanceScheduleByIdQuery.name,
      );
    }
    return maintenance;
  }
}
