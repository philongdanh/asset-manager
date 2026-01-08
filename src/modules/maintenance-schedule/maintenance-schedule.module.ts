import { Module, Provider } from '@nestjs/common';
import { MAINTENANCE_SCHEDULE_REPOSITORY } from './domain';
import { PrismaMaintenanceScheduleRepository } from './infrastructure';
import {
  CreateMaintenanceScheduleHandler,
  StartMaintenanceHandler,
  CompleteMaintenanceHandler,
  CancelMaintenanceHandler,
  DeleteMaintenanceScheduleHandler,
  GetMaintenanceSchedulesHandler,
  GetMaintenanceScheduleDetailsHandler,
} from './application';
import { MaintenanceScheduleController } from './presentation';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { ASSET_REPOSITORY } from '../asset/domain';
import { PrismaAssetRepository } from '../asset/infrastructure/persistence/repositories/prisma-asset.repository';
import { ORGANIZATION_REPOSITORY } from '../organization/domain';
import { PrismaOrganizationRepository } from '../organization/infrastructure/persistence/repositories/prisma-organization.repository';
import { USER_REPOSITORY } from '../user/domain';
import { PrismaUserRepository } from '../user/infrastructure/persistence/repositories/prisma-user.repository';

const handlers: Provider[] = [
  CreateMaintenanceScheduleHandler,
  StartMaintenanceHandler,
  CompleteMaintenanceHandler,
  CancelMaintenanceHandler,
  DeleteMaintenanceScheduleHandler,
  GetMaintenanceSchedulesHandler,
  GetMaintenanceScheduleDetailsHandler,
];

@Module({
  controllers: [MaintenanceScheduleController],
  providers: [
    PrismaService,
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    {
      provide: MAINTENANCE_SCHEDULE_REPOSITORY,
      useClass: PrismaMaintenanceScheduleRepository,
    },
    {
      provide: ASSET_REPOSITORY,
      useClass: PrismaAssetRepository,
    },
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: PrismaOrganizationRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    ...handlers,
  ],
  exports: [MAINTENANCE_SCHEDULE_REPOSITORY],
})
export class MaintenanceScheduleModule {}
