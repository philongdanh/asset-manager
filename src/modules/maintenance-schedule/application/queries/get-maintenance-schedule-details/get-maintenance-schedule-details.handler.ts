import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  MAINTENANCE_SCHEDULE_REPOSITORY,
  type IMaintenanceScheduleRepository,
} from '../../../domain';
import { GetMaintenanceScheduleDetailsQuery } from './get-maintenance-schedule-details.query';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from '../../../../asset/domain';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '../../../../organization/domain';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../../user/domain';
import { MaintenanceScheduleResult } from '../../dtos/maintenance-schedule.result';

@Injectable()
export class GetMaintenanceScheduleDetailsHandler {
  constructor(
    @Inject(MAINTENANCE_SCHEDULE_REPOSITORY)
    private readonly maintenanceRepo: IMaintenanceScheduleRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepo: IAssetRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) { }

  async execute(
    query: GetMaintenanceScheduleDetailsQuery,
  ): Promise<MaintenanceScheduleResult> {
    const maintenance = await this.maintenanceRepo.findById(query.id);
    if (!maintenance) {
      throw new UseCaseException(
        `Maintenance schedule with id ${query.id} not found`,
        GetMaintenanceScheduleDetailsQuery.name,
      );
    }

    const [asset, organization, performedByUser] = await Promise.all([
      this.assetRepo.findById(maintenance.assetId),
      this.orgRepo.findById(maintenance.organizationId),
      maintenance.performedByUserId
        ? this.userRepo.findById(maintenance.performedByUserId)
        : null,
    ]);

    return {
      maintenance,
      asset,
      organization,
      performedByUser,
    };
  }
}
