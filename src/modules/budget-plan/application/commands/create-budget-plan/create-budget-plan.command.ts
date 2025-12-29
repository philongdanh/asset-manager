import { BudgetType } from 'src/modules/budget-plan/domain';

export class CreateBudgetPlanCommand {
  constructor(
    public readonly organizationId: string,
    public readonly departmentId: string,
    public readonly fiscalYear: number,
    public readonly budgetType: BudgetType,
    public readonly allocatedAmount: number,
  ) {}
}
