import { BudgetPlan, BudgetStatus, BudgetType } from './budget-plan.entity';

export const BUDGET_PLAN_REPOSITORY = Symbol('BUDGET_PLAN_REPOSITORY');

export interface IBudgetPlanRepository {
  // --- Query Methods ---

  findById(id: string): Promise<BudgetPlan | null>;

  findByOrganization(organizationId: string): Promise<BudgetPlan[]>;

  findByDepartment(departmentId: string): Promise<BudgetPlan[]>;

  findByDepartmentAndYear(
    organizationId: string,
    departmentId: string,
    fiscalYear: number,
  ): Promise<BudgetPlan | null>;

  findByStatus(
    organizationId: string,
    status: BudgetStatus,
  ): Promise<BudgetPlan[]>;

  findByBudgetType(
    organizationId: string,
    budgetType: BudgetType,
  ): Promise<BudgetPlan[]>;

  findAll(
    organizationId: string,
    options?: {
      fiscalYear?: number;
      departmentId?: string;
      status?: BudgetStatus;
      budgetType?: BudgetType;
      minAmount?: number;
      maxAmount?: number;
      limit?: number;
      offset?: number;
      includeDepartmentInfo?: boolean;
    },
  ): Promise<{ data: BudgetPlan[]; total: number }>;

  // --- Validation Methods ---

  existsById(id: string): Promise<boolean>;

  existsByYearAndDepartment(
    organizationId: string,
    departmentId: string,
    fiscalYear: number,
    budgetType?: BudgetType,
  ): Promise<boolean>;

  // --- Persistence Methods ---

  save(budgetPlan: BudgetPlan): Promise<BudgetPlan>;

  update(budgetPlan: BudgetPlan): Promise<BudgetPlan>;

  saveMany(budgetPlans: BudgetPlan[]): Promise<void>;

  delete(id: string): Promise<void>;

  deleteMany(ids: string[]): Promise<void>;

  deleteByDepartment(departmentId: string): Promise<void>;

  // --- Special Methods ---

  getRemainingBudget(
    organizationId: string,
    departmentId: string,
    fiscalYear: number,
  ): Promise<number>;

  getBudgetSummary(
    organizationId: string,
    fiscalYear?: number,
  ): Promise<{
    totalAllocated: number;
    totalSpent: number;
    totalRemaining: number;
    byDepartment: Record<
      string,
      {
        allocated: number;
        spent: number;
        remaining: number;
        utilizationRate: number;
      }
    >;
    byType: Record<
      BudgetType,
      {
        allocated: number;
        spent: number;
        remaining: number;
        planCount: number;
      }
    >;
    byStatus: Record<BudgetStatus, number>;
  }>;

  findActiveBudgets(
    organizationId: string,
    departmentId?: string,
  ): Promise<BudgetPlan[]>;

  findOverBudgetPlans(
    organizationId: string,
    threshold?: number,
  ): Promise<BudgetPlan[]>;

  // --- Statistics Methods ---

  getBudgetUtilizationReport(
    organizationId: string,
    fiscalYear: number,
  ): Promise<{
    overallUtilization: number;
    departmentUtilization: Array<{
      departmentId: string;
      departmentName: string;
      allocated: number;
      spent: number;
      remaining: number;
      utilizationRate: number;
    }>;
    monthlySpending: Array<{
      month: number;
      spent: number;
      allocated: number;
    }>;
  }>;

  // --- Budget Analysis ---

  getBudgetForecast(
    organizationId: string,
    departmentId: string,
    months: number,
  ): Promise<{
    currentSpendingRate: number;
    projectedSpending: number;
    projectedRemaining: number;
    willExceedBudget: boolean;
    estimatedExceedDate?: Date;
  }>;

  // --- Bulk Operations ---

  getBudgetsByDepartmentIds(
    departmentIds: string[],
    fiscalYear?: number,
  ): Promise<Record<string, BudgetPlan[]>>;
}
