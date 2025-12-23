import { Module } from '@nestjs/common';
import {
  CreateRoleUseCase,
  FindRolesUseCase,
} from 'src/application/identity/role';
import { ROLE_REPOSITORY } from 'src/domain/identity/role';
import { PERMISSION_REPOSITORY } from 'src/domain/identity/permission';
import { PrismaRoleRepository } from 'src/infrastructure/identity/role';
import { PrismaPermissionRepository } from 'src/infrastructure/identity/permission';
import { PrismaService } from 'src/infrastructure/prisma';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { RoleController } from './role.controller';

@Module({
  controllers: [RoleController],
  providers: [
    CreateRoleUseCase,
    FindRolesUseCase,
    {
      provide: ROLE_REPOSITORY,
      useClass: PrismaRoleRepository,
    },
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PrismaPermissionRepository,
    },
    {
      provide: ID_GENERATOR,
      useValue: { generate: () => crypto.randomUUID() },
    },
    PrismaService,
  ],
})
export class RoleModule {}
