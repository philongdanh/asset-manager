import { BudgetPlan } from './budget-plan.entity';

export const BUDGET_PLAN_REPOSITORY = Symbol('BUDGET_PLAN_REPOSITORY');

export interface IBudgetPlanRepository {
  // --- Query Methods ---

  findById(id: string): Promise<BudgetPlan | null>;

  findByDepartmentAndYear(
    organizationId: string,
    departmentId: string,
    fiscalYear: number,
  ): Promise<BudgetPlan | null>;

  findAll(
    organizationId: string,
    options?: {
      fiscalYear?: number;
      departmentId?: string;
      status?: string; // e.g., 'DRAFT', 'APPROVED', 'CLOSED'
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: BudgetPlan[]; total: number }>;

  getRemainingBudget(
    organizationId: string,
    departmentId: string,
    fiscalYear: number,
  ): Promise<number>;

  // --- Validation Methods ---

  existsByYear(
    organizationId: string,
    departmentId: string,
    fiscalYear: number,
  ): Promise<boolean>;

  // --- Persistence Methods ---

  save(budgetPlan: BudgetPlan): Promise<BudgetPlan>;

  delete(id: string): Promise<void>;
}
