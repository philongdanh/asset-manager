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

const CommandHandlers = [
  CreateRoleHandler,
  UpdateRoleHandler,
  DeleteRoleHandler,
];
const QueryHandlers = [GetRolesHandler, GetRoleDetailsHandler];

@Module({
  imports: [CqrsModule],
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
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class RoleModule {}
