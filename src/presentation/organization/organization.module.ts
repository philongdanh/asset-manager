import { Module } from '@nestjs/common';
import { OrgController } from './organization.controller';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateOrganizationUseCase } from 'src/application/organization';
import { PrismaOrgRepository } from 'src/infrastructure/organization/prisma-organization.repository';
import { ORGANIZATION_REPOSITORY } from 'src/domain/organization';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/id-generator/uuid-generator.service';

@Module({
  controllers: [OrgController],
  providers: [
    CreateOrganizationUseCase,
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: PrismaOrgRepository,
    },
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    PrismaService,
  ],
})
export class OrganizationModule {}
