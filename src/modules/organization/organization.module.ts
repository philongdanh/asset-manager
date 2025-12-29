import { Module } from '@nestjs/common';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { ORGANIZATION_REPOSITORY } from './domain';
import { PrismaOrganizationRepository } from './infrastructure';
import {
  CreateOrganizationHandler,
  UpdateOrganizationHandler,
  GetOrganizationsHandler,
  GetOrganizationDetailsHandler,
} from './application';
import { OrganizationController } from './presentation';

@Module({
  controllers: [OrganizationController],
  providers: [
    PrismaService,
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: PrismaOrganizationRepository,
    },
    CreateOrganizationHandler,
    UpdateOrganizationHandler,
    GetOrganizationsHandler,
    GetOrganizationDetailsHandler,
  ],
})
export class OrganizationModule {}
