import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  MAINTENANCE_SCHEDULE_REPOSITORY,
  type IMaintenanceScheduleRepository,
  MaintenanceSchedule,
} from '../../../domain';
import { StartMaintenanceCommand } from './start-maintenance.command';

@Injectable()
export class StartMaintenanceHandler {
  constructor(
    @Inject(MAINTENANCE_SCHEDULE_REPOSITORY)
    private readonly maintenanceRepo: IMaintenanceScheduleRepository,
  ) {}

  async execute(cmd: StartMaintenanceCommand): Promise<MaintenanceSchedule> {
    const maintenance = await this.maintenanceRepo.findById(cmd.id);
    if (!maintenance) {
      throw new UseCaseException(
        `Maintenance schedule with id ${cmd.id} not found`,
        StartMaintenanceCommand.name,
      );
    }

    maintenance.startMaintenance(cmd.performedByUserId);
    return await this.maintenanceRepo.update(maintenance);
  }
}
