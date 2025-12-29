import { Module } from '@nestjs/common';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { PrismaService } from 'src/shared/infrastructure/prisma';
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
