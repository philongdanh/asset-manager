import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  MAINTENANCE_SCHEDULE_REPOSITORY,
  type IMaintenanceScheduleRepository,
  MaintenanceSchedule,
} from '../../../domain';
import { CancelMaintenanceCommand } from './cancel-maintenance.command';

@Injectable()
export class CancelMaintenanceHandler {
  constructor(
    @Inject(MAINTENANCE_SCHEDULE_REPOSITORY)
    private readonly maintenanceRepo: IMaintenanceScheduleRepository,
  ) {}

  async execute(cmd: CancelMaintenanceCommand): Promise<MaintenanceSchedule> {
    const maintenance = await this.maintenanceRepo.findById(cmd.id);
    if (!maintenance) {
      throw new UseCaseException(
        `Maintenance schedule with id ${cmd.id} not found`,
        CancelMaintenanceCommand.name,
      );
    }

    maintenance.cancel(cmd.reason);
    return await this.maintenanceRepo.update(maintenance);
  }
}
