import { Module } from '@nestjs/common';
import { ID_GENERATOR } from 'src/shared/domain/interfaces';
import { UuidGeneratorService } from 'src/shared/infrastructure/id-generator';
import { PrismaService } from 'src/shared/infrastructure/prisma';
import { DEPARTMENT_REPOSITORY } from './domain';
import { PrismaDepartmentRepository } from './infrastructure';
import { CreateDepartmentHandler } from './application';
import { DepartmentController } from './presentation';

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
    CreateDepartmentHandler,
  ],
})
export class DepartmentModule {}
