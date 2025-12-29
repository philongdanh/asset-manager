import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  BUDGET_PLAN_REPOSITORY,
  type IBudgetPlanRepository,
  BudgetPlan,
} from 'src/domain/finance-accounting/budget-plan';
import { GetBudgetPlanDetailsQuery } from '../get-budget-plan-details.query';

@Injectable()
export class GetBudgetPlanDetailsHandler {
  constructor(
    @Inject(BUDGET_PLAN_REPOSITORY)
    private readonly repository: IBudgetPlanRepository,
  ) {}

  async execute(query: GetBudgetPlanDetailsQuery): Promise<BudgetPlan> {
    const plan = await this.repository.findById(query.id);
    if (!plan) {
      throw new UseCaseException(
        'Budget plan not found',
        'GetBudgetPlanDetailsQuery',
      );
    }
    return plan;
  }
}
