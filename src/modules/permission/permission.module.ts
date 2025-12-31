import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { PERMISSION_REPOSITORY } from './domain';
import { PrismaPermissionRepository } from './infrastructure';
import {
  CreatePermissionHandler,
  UpdatePermissionHandler,
  DeletePermissionHandler,
  GetPermissionsHandler,
  GetPermissionDetailsHandler,
} from './application';
import { PermissionController } from './presentation';

const CommandHandlers = [
  CreatePermissionHandler,
  UpdatePermissionHandler,
  DeletePermissionHandler,
];
const QueryHandlers = [GetPermissionsHandler, GetPermissionDetailsHandler];

@Module({
  imports: [CqrsModule],
  controllers: [PermissionController],
  providers: [
    PrismaService,
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PrismaPermissionRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class PermissionModule {}
