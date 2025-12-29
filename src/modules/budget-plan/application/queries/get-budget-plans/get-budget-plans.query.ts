import { BudgetStatus, BudgetType } from 'src/modules/budget-plan/domain';

export class GetBudgetPlansQuery {
  constructor(
    public readonly organizationId: string,
    public readonly options: {
      fiscalYear?: number;
      departmentId?: string;
      status?: BudgetStatus;
      budgetType?: BudgetType;
      limit?: number;
      offset?: number;
    } = {},
  ) {}
}
