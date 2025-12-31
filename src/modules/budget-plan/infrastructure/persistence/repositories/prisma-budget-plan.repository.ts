import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import {
  IBudgetPlanRepository,
  BudgetPlan,
  BudgetStatus,
  BudgetType,
} from 'src/modules/budget-plan/domain';
import { BudgetPlanMapper } from '../mappers/budget-plan.mapper';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PrismaBudgetPlanRepository implements IBudgetPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<BudgetPlan | null> {
    const raw = await this.prisma.budgetPlan.findUnique({ where: { id } });
    return raw ? BudgetPlanMapper.toDomain(raw) : null;
  }

  async findByOrganization(organizationId: string): Promise<BudgetPlan[]> {
    const raws = await this.prisma.budgetPlan.findMany({
      where: { organizationId },
    });
    return raws.map(BudgetPlanMapper.toDomain);
  }

  async findByDepartment(departmentId: string): Promise<BudgetPlan[]> {
    const raws = await this.prisma.budgetPlan.findMany({
      where: { departmentId },
    });
    return raws.map(BudgetPlanMapper.toDomain);
  }

  async findByDepartmentAndYear(
    organizationId: string,
    departmentId: string,
    fiscalYear: number,
  ): Promise<BudgetPlan | null> {
    const raw = await this.prisma.budgetPlan.findFirst({
      where: { organizationId, departmentId, fiscalYear },
    });
    return raw ? BudgetPlanMapper.toDomain(raw) : null;
  }

  async findByStatus(
    organizationId: string,
    status: BudgetStatus,
  ): Promise<BudgetPlan[]> {
    const raws = await this.prisma.budgetPlan.findMany({
      where: { organizationId, status },
    });
    return raws.map(BudgetPlanMapper.toDomain);
  }

  async findByBudgetType(
    organizationId: string,
    budgetType: BudgetType,
  ): Promise<BudgetPlan[]> {
    const raws = await this.prisma.budgetPlan.findMany({
      where: { organizationId, budgetType },
    });
    return raws.map(BudgetPlanMapper.toDomain);
  }

  async findAll(
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
  ): Promise<{ data: BudgetPlan[]; total: number }> {
    const where: Prisma.BudgetPlanWhereInput = { organizationId };

    if (options?.fiscalYear) where.fiscalYear = options.fiscalYear;
    if (options?.departmentId) where.departmentId = options.departmentId;
    if (options?.status) where.status = options.status;
    if (options?.budgetType) where.budgetType = options.budgetType;
    if (options?.minAmount || options?.maxAmount) {
      where.allocatedAmount = {};
      if (options.minAmount) where.allocatedAmount.gte = options.minAmount;
      if (options.maxAmount) where.allocatedAmount.lte = options.maxAmount;
    }

    const [raws, total] = await Promise.all([
      this.prisma.budgetPlan.findMany({
        where,
        take: options?.limit,
        skip: options?.offset,
        orderBy: { updatedAt: 'desc' },
        include: options?.includeDepartmentInfo
          ? { department: true }
          : undefined,
      }),
      this.prisma.budgetPlan.count({ where }),
    ]);

    return {
      data: raws.map(BudgetPlanMapper.toDomain),
      total,
    };
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.budgetPlan.count({ where: { id } });
    return count > 0;
  }

  async existsByYearAndDepartment(
    organizationId: string,
    departmentId: string,
    fiscalYear: number,
    budgetType?: BudgetType,
  ): Promise<boolean> {
    const where: Prisma.BudgetPlanWhereInput = {
      organizationId,
      departmentId,
      fiscalYear,
    };
    if (budgetType) where.budgetType = budgetType;
    const count = await this.prisma.budgetPlan.count({ where });
    return count > 0;
  }

  async save(budgetPlan: BudgetPlan): Promise<BudgetPlan> {
    const { data } = BudgetPlanMapper.toPersistence(budgetPlan);
    const raw = await this.prisma.budgetPlan.create({ data });
    return BudgetPlanMapper.toDomain(raw);
  }

  async update(budgetPlan: BudgetPlan): Promise<BudgetPlan> {
    const { data } = BudgetPlanMapper.toPersistence(budgetPlan);
    const raw = await this.prisma.budgetPlan.update({
      where: { id: budgetPlan.id },
      data,
    });
    return BudgetPlanMapper.toDomain(raw);
  }

  async saveMany(budgetPlans: BudgetPlan[]): Promise<void> {
    await this.prisma.$transaction(
      budgetPlans.map((bp) => {
        const { data } = BudgetPlanMapper.toPersistence(bp);
        return this.prisma.budgetPlan.create({ data });
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.budgetPlan.delete({ where: { id } });
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.prisma.budgetPlan.deleteMany({ where: { id: { in: ids } } });
  }

  async deleteByDepartment(departmentId: string): Promise<void> {
    await this.prisma.budgetPlan.deleteMany({ where: { departmentId } });
  }

  async getRemainingBudget(
    organizationId: string,
    departmentId: string,
    fiscalYear: number,
  ): Promise<number> {
    const plans = await this.prisma.budgetPlan.findMany({
      where: { organizationId, departmentId, fiscalYear },
    });

    let totalRemaining = 0;
    for (const plan of plans) {
      totalRemaining +=
        plan.allocatedAmount.toNumber() - plan.spentAmount.toNumber();
    }
    return totalRemaining;
  }

  async getBudgetSummary(
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
  }> {
    const where: Prisma.BudgetPlanWhereInput = { organizationId };
    if (fiscalYear) where.fiscalYear = fiscalYear;

    const plans = await this.prisma.budgetPlan.findMany({ where });

    const result = {
      totalAllocated: 0,
      totalSpent: 0,
      totalRemaining: 0,
      byDepartment: {} as Record<
        string,
        {
          allocated: number;
          spent: number;
          remaining: number;
          utilizationRate: number;
        }
      >,
      byType: {} as Record<
        BudgetType,
        {
          allocated: number;
          spent: number;
          remaining: number;
          planCount: number;
        }
      >,
      byStatus: {} as Record<BudgetStatus, number>,
    };

    for (const plan of plans) {
      const allocated = plan.allocatedAmount.toNumber();
      const spent = plan.spentAmount.toNumber();
      const remaining = allocated - spent;

      result.totalAllocated += allocated;
      result.totalSpent += spent;
      result.totalRemaining += remaining;

      if (!result.byDepartment[plan.departmentId]) {
        result.byDepartment[plan.departmentId] = {
          allocated: 0,
          spent: 0,
          remaining: 0,
          utilizationRate: 0,
        };
      }
      const dept = result.byDepartment[plan.departmentId];
      dept.allocated += allocated;
      dept.spent += spent;
      dept.remaining += remaining;
      dept.utilizationRate =
        dept.allocated > 0 ? (dept.spent / dept.allocated) * 100 : 0;

      const type = plan.budgetType as BudgetType;
      if (!result.byType[type]) {
        result.byType[type] = {
          allocated: 0,
          spent: 0,
          remaining: 0,
          planCount: 0,
        };
      }
      const t = result.byType[type];
      t.allocated += allocated;
      t.spent += spent;
      t.remaining += remaining;
      t.planCount++;

      const status = plan.status as BudgetStatus;
      if (!result.byStatus[status]) result.byStatus[status] = 0;
      result.byStatus[status]++;
    }

    return result;
  }

  async findActiveBudgets(
    organizationId: string,
    departmentId?: string,
  ): Promise<BudgetPlan[]> {
    const where: Prisma.BudgetPlanWhereInput = {
      organizationId,
      status: BudgetStatus.ACTIVE,
    };
    if (departmentId) where.departmentId = departmentId;
    const raws = await this.prisma.budgetPlan.findMany({ where });
    return raws.map(BudgetPlanMapper.toDomain);
  }

  async findOverBudgetPlans(
    organizationId: string,
    threshold?: number,
  ): Promise<BudgetPlan[]> {
    const raws = await this.prisma.budgetPlan.findMany({
      where: { organizationId },
    });

    const overBudget = raws.filter((raw) => {
      const allocated = raw.allocatedAmount.toNumber();
      const spent = raw.spentAmount.toNumber();
      if (spent > allocated) return true;
      if (threshold && spent > threshold) return true;
      return false;
    });

    return overBudget.map(BudgetPlanMapper.toDomain);
  }

  async getBudgetUtilizationReport(
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
  }> {
    const summary = await this.getBudgetSummary(organizationId, fiscalYear);
    const departmentUtilization = Object.keys(summary.byDepartment).map(
      (deptId) => {
        const data = summary.byDepartment[deptId];
        return {
          departmentId: deptId,
          departmentName: 'Unknown',
          ...data,
        };
      },
    );

    const deptIds = departmentUtilization.map((d) => d.departmentId);
    if (deptIds.length > 0) {
      const depts = await this.prisma.department.findMany({
        where: { id: { in: deptIds } },
      });
      const deptMap = new Map(depts.map((d) => [d.id, d.name]));
      departmentUtilization.forEach((d) => {
        d.departmentName = deptMap.get(d.departmentId) || 'Unknown';
      });
    }

    const overallUtilization =
      summary.totalAllocated > 0
        ? (summary.totalSpent / summary.totalAllocated) * 100
        : 0;

    return {
      overallUtilization,
      departmentUtilization,
      monthlySpending: [],
    };
  }

  async getBudgetForecast(
    organizationId: string,
    departmentId: string,
    months: number,
  ): Promise<{
    currentSpendingRate: number;
    projectedSpending: number;
    projectedRemaining: number;
    willExceedBudget: boolean;
    estimatedExceedDate?: Date;
  }> {
    const currentYear = new Date().getFullYear();
    const plans = await this.prisma.budgetPlan.findMany({
      where: { organizationId, departmentId, fiscalYear: currentYear },
    });

    let totalAllocated = 0;
    let totalSpent = 0;
    for (const p of plans) {
      totalAllocated += p.allocatedAmount.toNumber();
      totalSpent += p.spentAmount.toNumber();
    }

    const currentMonth = new Date().getMonth() + 1;
    const avgMonthlySpend = totalSpent / (currentMonth > 0 ? currentMonth : 1);

    const projectedSpending = totalSpent + avgMonthlySpend * months;
    const projectedRemaining = totalAllocated - projectedSpending;
    const willExceedBudget = projectedSpending > totalAllocated;

    return {
      currentSpendingRate: avgMonthlySpend,
      projectedSpending,
      projectedRemaining,
      willExceedBudget,
      estimatedExceedDate: willExceedBudget ? new Date() : undefined,
    };
  }

  async getBudgetsByDepartmentIds(
    departmentIds: string[],
    fiscalYear?: number,
  ): Promise<Record<string, BudgetPlan[]>> {
    const where: Prisma.BudgetPlanWhereInput = {
      departmentId: { in: departmentIds },
    };
    if (fiscalYear) where.fiscalYear = fiscalYear;

    const raws = await this.prisma.budgetPlan.findMany({ where });
    const result: Record<string, BudgetPlan[]> = {};

    for (const raw of raws) {
      if (!result[raw.departmentId]) result[raw.departmentId] = [];
      result[raw.departmentId].push(BudgetPlanMapper.toDomain(raw));
    }
    return result;
  }
}
