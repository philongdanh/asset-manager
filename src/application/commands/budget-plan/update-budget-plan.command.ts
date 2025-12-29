import {
  BudgetStatus,
  BudgetType,
} from 'src/domain/finance-accounting/budget-plan';

export class UpdateBudgetPlanCommand {
  constructor(
    public readonly id: string,
    public readonly allocatedAmount: number,
    public readonly budgetType: BudgetType,
    public readonly fiscalYear: number,
    public readonly status?: BudgetStatus,
  ) {}
}
