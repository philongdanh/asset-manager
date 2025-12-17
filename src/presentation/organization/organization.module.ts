import { Module } from '@nestjs/common';
import { CreateOrganizationUseCase } from 'src/application/organization';
import { ORGANIZATION_REPOSITORY } from 'src/domain/organization';
import { UuidGeneratorService } from 'src/infrastructure/id-generator';
import { PrismaOrgRepository } from 'src/infrastructure/organization';
import { PrismaService } from 'src/infrastructure/prisma';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { OrganizationController } from './organization.controller';

@Module({
  controllers: [OrganizationController],
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
