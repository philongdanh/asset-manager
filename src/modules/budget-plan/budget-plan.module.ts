import { Module } from '@nestjs/common';
import {
    CreateBudgetPlanHandler,
    UpdateBudgetPlanHandler,
    GetBudgetPlanDetailsHandler,
    GetBudgetPlansHandler,
} from './application';
import { BUDGET_PLAN_REPOSITORY } from './domain';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { PrismaBudgetPlanRepository } from './infrastructure';
import { BudgetPlanController } from './presentation';

@Module({
    controllers: [BudgetPlanController],
    providers: [
        PrismaService,
        {
            provide: ID_GENERATOR,
            useClass: UuidGeneratorService,
        },
        {
            provide: BUDGET_PLAN_REPOSITORY,
            useClass: PrismaBudgetPlanRepository,
        },
        CreateBudgetPlanHandler,
        UpdateBudgetPlanHandler,
        GetBudgetPlansHandler,
        GetBudgetPlanDetailsHandler,
    ],
    exports: [BUDGET_PLAN_REPOSITORY],
})
export class BudgetPlanModule { }
