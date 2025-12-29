import { Injectable, Inject } from '@nestjs/common';
import {
  BUDGET_PLAN_REPOSITORY,
  type IBudgetPlanRepository,
  BudgetPlan,
} from 'src/modules/budget-plan/domain';
import { GetBudgetPlansQuery } from './get-budget-plans.query';

@Injectable()
export class GetBudgetPlansHandler {
  constructor(
    @Inject(BUDGET_PLAN_REPOSITORY)
    private readonly repository: IBudgetPlanRepository,
  ) {}

  async execute(
    query: GetBudgetPlansQuery,
  ): Promise<{ data: BudgetPlan[]; total: number }> {
    return await this.repository.findAll(query.organizationId, query.options);
  }
}
