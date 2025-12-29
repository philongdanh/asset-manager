import { Expose } from 'class-transformer';
import {
  BudgetStatus,
  BudgetType,
} from 'src/domain/finance-accounting/budget-plan';

export class BudgetPlanResponse {
  @Expose()
  id: string;

  @Expose()
  organization_id: string;

  @Expose()
  department_id: string;

  @Expose()
  fiscal_year: number;

  @Expose()
  budget_type: BudgetType;

  @Expose()
  allocated_amount: number;

  @Expose()
  spent_amount: number;

  @Expose()
  status: BudgetStatus;

  @Expose()
  remaining_budget: number;

  @Expose()
  utilization_rate: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
