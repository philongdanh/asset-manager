import { Module } from '@nestjs/common';
import {
  CreateOrganizationUseCase,
  GetOrganizationsUseCase,
} from 'src/application/organization';
import { ORGANIZATION_REPOSITORY } from 'src/domain/modules/organization';
import { UuidGeneratorService } from 'src/infrastructure/id-generator';
import { PrismaOrganizationRepository } from 'src/infrastructure/organization';
import { PrismaService } from 'src/infrastructure/prisma';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { OrganizationController } from './organization.controller';

@Module({
  controllers: [OrganizationController],
  providers: [
    CreateOrganizationUseCase,
    GetOrganizationsUseCase,
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: PrismaOrganizationRepository,
    },
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    PrismaService,
  ],
})
export class OrganizationModule {}
