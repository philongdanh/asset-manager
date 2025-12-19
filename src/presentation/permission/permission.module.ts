import { Module } from '@nestjs/common';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { PermissionController } from './permission.controller';
import {
  CreatePermissionUseCase,
  FindPermissionsUseCase,
} from 'src/application/permission';
import { PERMISSION_REPOSITORY } from 'src/domain/identity/permission';
import { PrismaPermissionRepository } from 'src/infrastructure/permission';
import { UuidGeneratorService } from 'src/infrastructure/id-generator';
import { PrismaService } from 'src/infrastructure/prisma';

@Module({
  controllers: [PermissionController],
  providers: [
    CreatePermissionUseCase,
    FindPermissionsUseCase,
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
