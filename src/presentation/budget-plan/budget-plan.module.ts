import { Module } from '@nestjs/common';
import { CreateBudgetPlanHandler, UpdateBudgetPlanHandler } from 'src/application/commands/handlers';
import {
    GetBudgetPlanDetailsHandler,
    GetBudgetPlansHandler,
} from 'src/application/queries/handlers';
import { BUDGET_PLAN_REPOSITORY } from 'src/domain/finance-accounting/budget-plan';
import { ID_GENERATOR } from 'src/domain/core/interfaces';
import { UuidGeneratorService } from 'src/infrastructure/common/id-generator';
import { PrismaService } from 'src/infrastructure/persistence/prisma';
import { PrismaBudgetPlanRepository } from 'src/infrastructure/persistence/prisma/repositories';
import { BudgetPlanController } from './budget-plan.controller';

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
})
export class BudgetPlanModule { }
