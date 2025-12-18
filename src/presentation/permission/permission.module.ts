import { Module } from '@nestjs/common';
import {
  CreateOrganizationUseCase,
  GetOrganizationsUseCase,
} from 'src/application/organization';
import { ORGANIZATION_REPOSITORY } from 'src/domain/modules/organization';
import { UuidGeneratorService } from 'src/infrastructure/id-generator';
import { PrismaOrganizationRepository } from 'src/infrastructure/organization';
import { PrismaService } from 'src/infrastructure/prisma';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { PermissionController } from './permission.controller';
import {
  CreatePermissionUseCase,
  GetPermissionsUseCase,
} from 'src/application/permission';
import { PERMISSION_REPOSITORY } from 'src/domain/identity/permission';
import { PrismaPermissionRepository } from 'src/infrastructure/permission';

@Module({
  controllers: [PermissionController],
  providers: [
    CreatePermissionUseCase,
    GetPermissionsUseCase,
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PrismaPermissionRepository,
    },
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    PrismaService,
  ],
})
export class PermissionModule {}
