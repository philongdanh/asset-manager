import { Module } from '@nestjs/common';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
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
export class DepartmentModule { }
