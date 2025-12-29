import { Module } from '@nestjs/common';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { ROLE_REPOSITORY } from './domain';
import { PrismaRoleRepository } from './infrastructure';
import { CreateRoleHandler } from './application';
import { RoleController } from './presentation';

@Module({
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
    CreateRoleHandler,
  ],
})
export class RoleModule {}
