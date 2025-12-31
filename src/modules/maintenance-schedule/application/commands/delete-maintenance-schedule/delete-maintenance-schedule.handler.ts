import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMaintenanceScheduleCommand } from './delete-maintenance-schedule.command';
import {
  MAINTENANCE_SCHEDULE_REPOSITORY,
  type IMaintenanceScheduleRepository,
} from '../../../domain';

@CommandHandler(DeleteMaintenanceScheduleCommand)
export class DeleteMaintenanceScheduleHandler implements ICommandHandler<DeleteMaintenanceScheduleCommand> {
  constructor(
    @Inject(MAINTENANCE_SCHEDULE_REPOSITORY)
    private readonly maintenanceRepository: IMaintenanceScheduleRepository,
  ) {}

  async execute(command: DeleteMaintenanceScheduleCommand): Promise<void> {
    const exists = await this.maintenanceRepository.existsById(
      command.maintenanceId,
    );
    if (!exists) {
      throw new NotFoundException(
        `Maintenance schedule with ID ${command.maintenanceId} not found`,
      );
    }

    await this.maintenanceRepository.delete(command.maintenanceId);
  }
}
