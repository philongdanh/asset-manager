import { Expose } from 'class-transformer';
import { BudgetStatus, BudgetType } from 'src/modules/budget-plan/domain';

export class BudgetPlanResponse {
    @Expose()
    id: string;

    @Expose({ name: 'organization_id' })
    organizationId: string;

    @Expose({ name: 'department_id' })
    departmentId: string;

    @Expose({ name: 'fiscal_year' })
    fiscalYear: number;

    @Expose({ name: 'budget_type' })
    budgetType: BudgetType;

    @Expose({ name: 'allocated_amount' })
    allocatedAmount: number;

    @Expose({ name: 'spent_amount' })
    spentAmount: number;

    @Expose()
    status: BudgetStatus;

    @Expose({ name: 'remaining_budget' })
    remainingBudget: number;

    @Expose({ name: 'utilization_rate' })
    utilizationRate: number;

    @Expose({ name: 'created_at' })
    createdAt: Date;

    @Expose({ name: 'updated_at' })
    updatedAt: Date;
}
