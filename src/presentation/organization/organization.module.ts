import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { ORGANIZATION_REPOSITORY } from 'src/domain/identity/organization';
import { PrismaOrganizationRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma-organization.repository';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { GetOrganizationsHandler } from 'src/application/queries/handlers/get-organizations.handler';
import { CreateOrganizationHandler } from 'src/application/commands/handlers/create-organization.handler';
import { GetOrganizationDetails } from 'src/application/queries/handlers';
import { UpdateOrganizationHandler } from 'src/application/commands/handlers';

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
    GetOrganizationsHandler,
    GetOrganizationDetails,
    UpdateOrganizationHandler,
  ],
})
export class OrganizationModule {}
