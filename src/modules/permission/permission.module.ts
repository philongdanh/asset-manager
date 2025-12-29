import { Module } from '@nestjs/common';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { PERMISSION_REPOSITORY } from './domain';
import { PrismaPermissionRepository } from './infrastructure';
import { CreatePermissionHandler, GetPermissionsHandler } from './application';
import { PermissionController } from './presentation';
import { CqrsModule } from '@nestjs/cqrs';

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
    CreatePermissionHandler,
    GetPermissionsHandler,
  ],
})
export class PermissionModule {}
