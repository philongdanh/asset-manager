import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { PERMISSION_REPOSITORY } from './domain';
import { PrismaPermissionRepository } from './infrastructure';
import {
  GetPermissionsHandler,
  GetPermissionDetailsHandler,
} from './application';
import { PermissionController } from './presentation';
import { PrismaRoleRepository } from '../role/infrastructure';
import { ROLE_REPOSITORY } from '../role';

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
    {
      provide: ROLE_REPOSITORY,
      useClass: PrismaRoleRepository,
    },
    ...QueryHandlers,
  ],
})
export class PermissionModule {}
