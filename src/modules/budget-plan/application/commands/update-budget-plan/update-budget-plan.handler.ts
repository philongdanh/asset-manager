import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  BUDGET_PLAN_REPOSITORY,
  type IBudgetPlanRepository,
  BudgetPlan,
} from 'src/modules/budget-plan/domain';
import { UpdateBudgetPlanCommand } from './update-budget-plan.command';

@Injectable()
export class UpdateBudgetPlanHandler {
  constructor(
    @Inject(BUDGET_PLAN_REPOSITORY)
    private readonly repository: IBudgetPlanRepository,
  ) {}

  async execute(cmd: UpdateBudgetPlanCommand): Promise<BudgetPlan> {
    const budgetPlan = await this.repository.findById(cmd.id);
    if (!budgetPlan) {
      throw new UseCaseException(
        'Budget plan not found',
        'UpdateBudgetPlanHandler',
      );
    }

    budgetPlan.updateBudgetDetails(
      cmd.budgetType,
      cmd.allocatedAmount,
      cmd.fiscalYear,
    );

    if (cmd.status && budgetPlan.status !== cmd.status) {
      budgetPlan.updateStatus(cmd.status);
    }

    return await this.repository.update(budgetPlan);
  }
}
