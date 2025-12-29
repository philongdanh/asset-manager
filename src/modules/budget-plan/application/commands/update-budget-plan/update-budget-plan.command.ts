import {
    BudgetStatus,
    BudgetType,
} from 'src/modules/budget-plan/domain';

export class UpdateBudgetPlanCommand {
    constructor(
        public readonly id: string,
        public readonly allocatedAmount: number,
        public readonly budgetType: BudgetType,
        public readonly fiscalYear: number,
        public readonly status?: BudgetStatus,
    ) { }
}
