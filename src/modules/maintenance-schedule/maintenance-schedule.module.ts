import { Module, Provider } from '@nestjs/common';
import { MAINTENANCE_SCHEDULE_REPOSITORY } from './domain';
import { PrismaMaintenanceScheduleRepository } from './infrastructure';
import {
  CreateMaintenanceScheduleHandler,
  StartMaintenanceHandler,
  CompleteMaintenanceHandler,
  CancelMaintenanceHandler,
  GetMaintenanceSchedulesHandler,
  GetMaintenanceScheduleDetailsHandler,
} from './application';
import { MaintenanceScheduleController } from './presentation';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { ID_GENERATOR } from '../../domain/core/interfaces';
import { UuidGeneratorService } from '../../infrastructure/common/id-generator';
import { ASSET_REPOSITORY } from '../asset/domain';
import { PrismaAssetRepository } from '../asset/infrastructure/persistence/repositories/prisma-asset.repository';

const handlers: Provider[] = [
  CreateMaintenanceScheduleHandler,
  StartMaintenanceHandler,
  CompleteMaintenanceHandler,
  CancelMaintenanceHandler,
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
    ...handlers,
  ],
  exports: [MAINTENANCE_SCHEDULE_REPOSITORY],
})
export class MaintenanceScheduleModule {}
