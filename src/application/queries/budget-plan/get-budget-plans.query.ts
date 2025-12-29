import { BudgetStatus, BudgetType } from 'src/domain/finance-accounting/budget-plan';

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
    ) { }
}
