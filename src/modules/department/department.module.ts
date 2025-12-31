import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { DEPARTMENT_REPOSITORY } from './domain';
import { PrismaDepartmentRepository } from './infrastructure';
import {
  CreateDepartmentHandler,
  UpdateDepartmentHandler,
  DeleteDepartmentHandler,
  GetDepartmentsHandler,
  GetDepartmentDetailsHandler,
} from './application';
import { DepartmentController } from './presentation';

const CommandHandlers = [
  CreateDepartmentHandler,
  UpdateDepartmentHandler,
  DeleteDepartmentHandler,
];
const QueryHandlers = [GetDepartmentsHandler, GetDepartmentDetailsHandler];

@Module({
  imports: [CqrsModule],
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
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class DepartmentModule {}
