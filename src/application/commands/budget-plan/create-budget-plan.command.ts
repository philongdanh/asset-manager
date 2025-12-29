import { BudgetType } from 'src/domain/finance-accounting/budget-plan';

export class CreateBudgetPlanCommand {
    constructor(
        public readonly organizationId: string,
        public readonly departmentId: string,
        public readonly fiscalYear: number,
        public readonly budgetType: BudgetType,
        public readonly allocatedAmount: number,
    ) { }
}
