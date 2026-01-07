import { Injectable, Inject } from '@nestjs/common';
import {
  MAINTENANCE_SCHEDULE_REPOSITORY,
  type IMaintenanceScheduleRepository,
} from '../../../domain';
import { GetMaintenanceSchedulesQuery } from './get-maintenance-schedules.query';
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
export class GetMaintenanceSchedulesHandler {
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
    query: GetMaintenanceSchedulesQuery,
  ): Promise<{ data: MaintenanceScheduleResult[]; total: number }> {
    const { data: list, total } = await this.maintenanceRepo.findAll(
      query.organizationId,
      query.options,
    );

    const enrichedData = await Promise.all(
      list.map(async (maintenance) => {
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
      }),
    );

    return { data: enrichedData, total };
  }
}
