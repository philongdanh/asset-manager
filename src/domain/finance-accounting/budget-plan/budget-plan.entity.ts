import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class BudgetPlan extends BaseEntity {
  private _organizationId: string;
  private _departmentId: string;
  private _fiscalYear: number;
  private _totalBudget: number;
  private _usedBudget: number;
  private _status: string;
  private _notes: string | null;

  protected constructor(builder: BudgetPlanBuilder) {
    super(builder.id);
    this._organizationId = builder.organizationId;
    this._departmentId = builder.departmentId;
    this._fiscalYear = builder.fiscalYear;
    this._totalBudget = builder.totalBudget;
    this._usedBudget = builder.usedBudget;
    this._status = builder.status;
    this._notes = builder.notes;
  }

  // --- Getters ---
  public get organizationId(): string {
    return this._organizationId;
  }

  public get departmentId(): string {
    return this._departmentId;
  }

  public get fiscalYear(): number {
    return this._fiscalYear;
  }

  public get totalBudget(): number {
    return this._totalBudget;
  }

  public get usedBudget(): number {
    return this._usedBudget;
  }

  public get status(): string {
    return this._status;
  }

  public get notes(): string | null {
    return this._notes;
  }

  // --- Business Methods ---
  public allocateBudget(amount: number): void {
    if (amount <= 0) {
      throw new BusinessRuleViolationException(
        'INVALID_ALLOCATION_AMOUNT',
        'Allocation amount must be greater than zero.',
      );
    }
    if (this._usedBudget + amount > this._totalBudget) {
      throw new BusinessRuleViolationException(
        'BUDGET_EXCEEDED',
        'Total budget exceeded for this department.',
      );
    }
    this._usedBudget += amount;
  }

  public updateStatus(newStatus: string): void {
    const validStatuses = ['DRAFT', 'APPROVED', 'CLOSED'];
    if (!validStatuses.includes(newStatus)) {
      throw new BusinessRuleViolationException(
        'INVALID_BUDGET_STATUS',
        `Status must be one of: ${validStatuses.join(', ')}`,
      );
    }
    this._status = newStatus;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    organizationId: string,
    departmentId: string,
    fiscalYear: number,
    totalBudget: number,
  ): BudgetPlanBuilder {
    return new BudgetPlanBuilder(
      id,
      organizationId,
      departmentId,
      fiscalYear,
      totalBudget,
    );
  }

  public static createFromBuilder(builder: BudgetPlanBuilder): BudgetPlan {
    return new BudgetPlan(builder);
  }
}

export class BudgetPlanBuilder {
  public readonly id: string;
  public readonly organizationId: string;
  public readonly departmentId: string;
  public readonly fiscalYear: number;
  public totalBudget: number;
  public usedBudget: number = 0;
  public status: string = 'DRAFT';
  public notes: string | null = null;

  constructor(
    id: string,
    organizationId: string,
    departmentId: string,
    fiscalYear: number,
    totalBudget: number,
  ) {
    this.id = id;
    this.organizationId = organizationId;
    this.departmentId = departmentId;
    this.fiscalYear = fiscalYear;
    this.totalBudget = totalBudget;
  }

  public withUsedBudget(amount: number): this {
    this.usedBudget = amount;
    return this;
  }

  public withStatus(status: string): this {
    this.status = status;
    return this;
  }

  public withNotes(notes: string | null): this {
    this.notes = notes;
    return this;
  }

  public build(): BudgetPlan {
    this.validate();
    return BudgetPlan.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id || !this.organizationId || !this.departmentId) {
      throw new BusinessRuleViolationException(
        'BUDGET_PLAN_REQUIRED_IDS',
        'ID, Organization ID, and Department ID are mandatory.',
      );
    }
    if (this.totalBudget < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_TOTAL_BUDGET',
        'Total budget cannot be negative.',
      );
    }
    if (this.fiscalYear < 2000 || this.fiscalYear > 2100) {
      throw new BusinessRuleViolationException(
        'INVALID_FISCAL_YEAR',
        'Fiscal year is out of valid range.',
      );
    }
  }
}
