import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { PERMISSION_REPOSITORY } from 'src/modules/permission/domain/repositories/permission.repository.interface';
import { PrismaPermissionRepository } from 'src/modules/permission/infrastructure/persistence/repositories/prisma-permission.repository';
import { GetPermissionsHandler } from 'src/modules/permission/application/queries/get-permissions/get-permissions.handler';
import { GetPermissionDetailsHandler } from 'src/modules/permission/application/queries/get-permission-details/get-permission-details.handler';
import { PermissionController } from 'src/modules/permission/presentation/controllers/permission.controller';
import { PrismaRoleRepository } from 'src/modules/role/infrastructure/persistence/repositories/prisma-role.repository';
import { ROLE_REPOSITORY } from 'src/modules/role/domain/repositories/role.repository.interface';

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
