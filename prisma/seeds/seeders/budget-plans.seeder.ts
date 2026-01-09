import { BudgetPlan, Department, PrismaClient, Tenant } from 'generated/client';
import { BUDGET_PLANS_DATA } from '../data';

export const seedBudgetPlans = async (
  prisma: PrismaClient,
  tenants: Tenant[],
  departments: Department[],
): Promise<BudgetPlan[]> => {
  console.log('Seeding budget plans...');
  const budgetPlans: BudgetPlan[] = [];

  for (const tenant of tenants) {
    const tenantDepts = departments.filter((d) => d.tenantId === tenant.id);
    const fiscalYear = 2024;

    for (let i = 0; i < BUDGET_PLANS_DATA.length; i++) {
      const dept = tenantDepts[i];
      if (!dept) continue;

      const planData = BUDGET_PLANS_DATA[i];

      const budgetPlan = await prisma.budgetPlan.upsert({
        where: { id: `budget-${tenant.id}-${i + 1}` },
        update: {},
        create: {
          id: `budget-${tenant.id}-${i + 1}`,
          tenantId: tenant.id,
          departmentId: dept.id,
          fiscalYear: fiscalYear,
          budgetType: planData.type,
          allocatedAmount: planData.amount,
          spentAmount: planData.spent,
          status: 'IN_PROGRESS',
        },
      });
      budgetPlans.push(budgetPlan);
    }
  }
  return budgetPlans;
};
