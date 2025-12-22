import { Module } from '@nestjs/common';
import {
  CreateOrganizationUseCase,
  UpdateOrganizationUseCase,
} from 'src/application/organization-management/organization';
import { ORGANIZATION_REPOSITORY } from 'src/domain/identity/organization';
import { UuidGeneratorService } from 'src/infrastructure/id-generator';
import { PrismaOrganizationRepository } from 'src/infrastructure/organization';
import { PrismaService } from 'src/infrastructure/prisma';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { OrganizationController } from './organization.controller';

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
    CreateOrganizationUseCase,
    UpdateOrganizationUseCase,
  ],
})
export class OrganizationModule {}
