import { Injectable, Inject } from '@nestjs/common';
import { ID_GENERATOR, type IIdGenerator } from 'src/domain/core/interfaces';
import {
  BUDGET_PLAN_REPOSITORY,
  type IBudgetPlanRepository,
  BudgetPlan,
} from 'src/domain/finance-accounting/budget-plan';
import { CreateBudgetPlanCommand } from '../create-budget-plan.command';
import { UseCaseException } from 'src/application/core/exceptions';

@Injectable()
export class CreateBudgetPlanHandler {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(BUDGET_PLAN_REPOSITORY)
    private readonly repository: IBudgetPlanRepository,
  ) {}

  async execute(cmd: CreateBudgetPlanCommand): Promise<BudgetPlan> {
    const exists = await this.repository.existsByYearAndDepartment(
      cmd.organizationId,
      cmd.departmentId,
      cmd.fiscalYear,
      cmd.budgetType,
    );

    if (exists) {
      throw new UseCaseException(
        'Budget plan already exists for this department and year.',
        'CreateBudgetPlanHandler',
      );
    }

    const id = this.idGenerator.generate();
    const builder = BudgetPlan.builder(
      id,
      cmd.organizationId,
      cmd.departmentId,
      cmd.fiscalYear,
      cmd.budgetType,
      cmd.allocatedAmount,
    );

    const budgetPlan = builder.build();
    return await this.repository.save(budgetPlan);
  }
}
