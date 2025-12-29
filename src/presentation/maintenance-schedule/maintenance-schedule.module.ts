import { Module } from '@nestjs/common';
import {
  CreateMaintenanceScheduleHandler,
  StartMaintenanceHandler,
  CompleteMaintenanceHandler,
  CancelMaintenanceHandler,
} from 'src/application/commands/maintenance-schedule/handlers';
import {
  GetMaintenanceSchedulesHandler,
  GetMaintenanceScheduleDetailsHandler,
} from 'src/application/queries/handlers';
import { ASSET_REPOSITORY } from 'src/modules/asset/domain';
import { MAINTENANCE_SCHEDULE_REPOSITORY } from 'src/domain/maintenance/maintenance-schedule';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import {
  PrismaAssetRepository,
  PrismaMaintenanceScheduleRepository,
} from 'src/infrastructure/persistence/prisma/repositories';
import { MaintenanceScheduleController } from './maintenance-schedule.controller';

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
    CreateMaintenanceScheduleHandler,
    StartMaintenanceHandler,
    CompleteMaintenanceHandler,
    CancelMaintenanceHandler,
    GetMaintenanceSchedulesHandler,
    GetMaintenanceScheduleDetailsHandler,
  ],
})
export class MaintenanceScheduleModule {}
