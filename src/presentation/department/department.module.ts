import { Module } from '@nestjs/common';
import { UuidGeneratorService } from 'src/infrastructure/id-generator';
import { PrismaService } from 'src/infrastructure/prisma';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { DepartmentController } from './department.controller';
import { CreateDepartmentUseCase } from 'src/application/department';
import { DEPARTMENT_REPOSITORY } from 'src/domain/modules/department';
import { PrismaDepartmentRepository } from 'src/infrastructure/department';
import { ORGANIZATION_REPOSITORY } from 'src/domain/modules/organization';
import { PrismaOrganizationRepository } from 'src/infrastructure/organization';

@Module({
  controllers: [DepartmentController],
  providers: [
    PrismaService,
    {
      provide: ID_GENERATOR,
      useClass: UuidGeneratorService,
    },
    {
      provide: DEPARTMENT_REPOSITORY,
      useClass: PrismaDepartmentRepository,
    },
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: PrismaOrganizationRepository,
    },
    CreateDepartmentUseCase,
  ],
})
export class DepartmentModule {}
