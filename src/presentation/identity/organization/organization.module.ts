import { Module } from '@nestjs/common';
import { ORGANIZATION_REPOSITORY } from 'src/domain/identity/organization';
import { UuidGeneratorService } from 'src/infrastructure/id-generator';
import { PrismaOrganizationRepository } from 'src/infrastructure/identity/organization';
import { PrismaService } from 'src/infrastructure/prisma';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { OrganizationController } from './organization.controller';
import { CreateOrganizationUseCase } from 'src/application/commands/create-organization';
import { UpdateOrganizationUseCase } from 'src/application/commands/update-organization';

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
