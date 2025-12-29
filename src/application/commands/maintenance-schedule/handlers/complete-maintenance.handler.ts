import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  MAINTENANCE_SCHEDULE_REPOSITORY,
  type IMaintenanceScheduleRepository,
  MaintenanceSchedule,
} from 'src/domain/maintenance/maintenance-schedule';
import { CompleteMaintenanceCommand } from '../complete-maintenance.command';

@Injectable()
export class CompleteMaintenanceHandler {
  constructor(
    @Inject(MAINTENANCE_SCHEDULE_REPOSITORY)
    private readonly maintenanceRepo: IMaintenanceScheduleRepository,
  ) {}

  async execute(cmd: CompleteMaintenanceCommand): Promise<MaintenanceSchedule> {
    const maintenance = await this.maintenanceRepo.findById(cmd.id);
    if (!maintenance) {
      throw new UseCaseException(
        `Maintenance schedule with id ${cmd.id} not found`,
        CompleteMaintenanceCommand.name,
      );
    }

    maintenance.complete(cmd.result, cmd.actualCost);
    return await this.maintenanceRepo.update(maintenance);
  }
}
