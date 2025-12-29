import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import { ID_GENERATOR, type IIdGenerator } from 'src/domain/core/interfaces';
import {
  MAINTENANCE_SCHEDULE_REPOSITORY,
  type IMaintenanceScheduleRepository,
  MaintenanceSchedule,
} from '../../../domain';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from 'src/modules/asset/domain';
import { CreateMaintenanceScheduleCommand } from './create-maintenance-schedule.command';

@Injectable()
export class CreateMaintenanceScheduleHandler {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(MAINTENANCE_SCHEDULE_REPOSITORY)
    private readonly maintenanceRepo: IMaintenanceScheduleRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
  ) {}

  async execute(
    cmd: CreateMaintenanceScheduleCommand,
  ): Promise<MaintenanceSchedule> {
    const asset = await this.assetRepo.findById(cmd.assetId);
    if (!asset) {
      throw new UseCaseException(
        `Asset with id ${cmd.assetId} not found`,
        CreateMaintenanceScheduleCommand.name,
      );
    }

    const id = this.idGenerator.generate();
    const maintenance = MaintenanceSchedule.builder(
      id,
      cmd.assetId,
      cmd.organizationId,
      cmd.maintenanceType,
      cmd.scheduledDate,
    )
      .withDescription(cmd.description)
      .withEstimatedCost(cmd.estimatedCost)
      .build();

    return await this.maintenanceRepo.save(maintenance);
  }
}
