import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { ROLE_REPOSITORY } from './domain';
import { PrismaRoleRepository } from './infrastructure';
import {
  CreateRoleHandler,
  UpdateRoleHandler,
  DeleteRoleHandler,
  GetRolesHandler,
  GetRoleDetailsHandler,
} from './application';
import { RoleController } from './presentation';
import {
  PERMISSION_REPOSITORY,
  PermissionModule,
  PrismaPermissionRepository,
} from '../permission';
import { USER_REPOSITORY, PrismaUserRepository } from '../user';

const CommandHandlers = [
  CreateRoleHandler,
  UpdateRoleHandler,
  DeleteRoleHandler,
];
const QueryHandlers = [GetRolesHandler, GetRoleDetailsHandler];

@Module({
  imports: [CqrsModule, PermissionModule],
  controllers: [RoleController],
  providers: [
    PrismaService,
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    {
      provide: ROLE_REPOSITORY,
      useClass: PrismaRoleRepository,
    },
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PrismaPermissionRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class RoleModule {}
