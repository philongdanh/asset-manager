import {
  Prisma,
  BudgetPlan as PrismaBudgetPlan,
} from 'generated/prisma/client';
import {
  BudgetPlan,
  BudgetStatus,
  BudgetType,
} from 'src/domain/finance-accounting/budget-plan';

export class BudgetPlanMapper {
  static toDomain(raw: PrismaBudgetPlan): BudgetPlan {
    const builder = BudgetPlan.builder(
      raw.id,
      raw.organizationId,
      raw.departmentId,
      raw.fiscalYear,
      raw.budgetType as BudgetType,
      raw.allocatedAmount.toNumber(),
    )
      .withSpentAmount(raw.spentAmount.toNumber())
      .withStatus(raw.status as BudgetStatus)
      .withTimestamps(raw.createdAt, raw.updatedAt);

    return builder.build();
  }

  static toPersistence(budgetPlan: BudgetPlan): Prisma.BudgetPlanCreateArgs {
    return {
      data: {
        id: budgetPlan.id,
        organizationId: budgetPlan.organizationId,
        departmentId: budgetPlan.departmentId,
        fiscalYear: budgetPlan.fiscalYear,
        budgetType: budgetPlan.budgetType,
        allocatedAmount: budgetPlan.allocatedAmount,
        spentAmount: budgetPlan.spentAmount,
        status: budgetPlan.status,
        createdAt: budgetPlan.createdAt,
        updatedAt: budgetPlan.updatedAt,
      },
    };
  }
}
