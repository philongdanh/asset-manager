import { Module } from '@nestjs/common';
import { UuidGeneratorService } from 'src/infrastructure/id-generator';
import { PrismaService } from 'src/infrastructure/prisma';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { DepartmentController } from './department.controller';
import { DEPARTMENT_REPOSITORY } from 'src/domain/identity/department';
import { PrismaDepartmentRepository } from 'src/infrastructure/identity/department';
import { ORGANIZATION_REPOSITORY } from 'src/domain/identity/organization';
import { PrismaOrganizationRepository } from 'src/infrastructure/identity/organization';
import { CreateDepartmentUseCase } from 'src/application/identity/commands/create-department/create-department.use-case';

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
