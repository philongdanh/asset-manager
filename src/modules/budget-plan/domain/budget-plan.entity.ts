import { BaseEntity, BusinessRuleViolationException } from 'src/shared/domain';

// --- Enums ---
export enum BudgetStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED',
}

export enum BudgetType {
  OPERATIONAL = 'OPERATIONAL',
  CAPITAL = 'CAPITAL',
  PROJECT = 'PROJECT',
  MAINTENANCE = 'MAINTENANCE',
  PURCHASE = 'PURCHASE',
  UPGRADE = 'UPGRADE',
  EMERGENCY = 'EMERGENCY',
  TRAINING = 'TRAINING',
  OTHER = 'OTHER',
}

export class BudgetPlan extends BaseEntity {
  private _organizationId: string;
  private _departmentId: string;
  private _fiscalYear: number;
  private _budgetType: BudgetType;
  private _allocatedAmount: number;
  private _spentAmount: number;
  private _status: BudgetStatus;

  protected constructor(builder: BudgetPlanBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt);
    this._organizationId = builder.organizationId;
    this._departmentId = builder.departmentId;
    this._fiscalYear = builder.fiscalYear;
    this._budgetType = builder.budgetType;
    this._allocatedAmount = builder.allocatedAmount;
    this._spentAmount = builder.spentAmount;
    this._status = builder.status;
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

  public get budgetType(): BudgetType {
    return this._budgetType;
  }

  public get allocatedAmount(): number {
    return this._allocatedAmount;
  }

  public get spentAmount(): number {
    return this._spentAmount;
  }

  public get status(): BudgetStatus {
    return this._status;
  }

  public get remainingBudget(): number {
    return this._allocatedAmount - this._spentAmount;
  }

  public get utilizationRate(): number {
    if (this._allocatedAmount === 0) return 0;
    return (this._spentAmount / this._allocatedAmount) * 100;
  }

  // --- Business Methods ---
  public updateBudgetDetails(
    budgetType: BudgetType,
    allocatedAmount: number,
    fiscalYear: number,
  ): void {
    this.validateAllocatedAmount(allocatedAmount);
    this.validateFiscalYear(fiscalYear);

    this._budgetType = budgetType;
    this._allocatedAmount = allocatedAmount;
    this._fiscalYear = fiscalYear;
    this.markAsUpdated();
  }

  public allocateAdditionalAmount(additionalAmount: number): void {
    if (additionalAmount <= 0) {
      throw new BusinessRuleViolationException(
        'INVALID_ALLOCATION_AMOUNT',
        'Additional allocation amount must be greater than zero.',
      );
    }
    this._allocatedAmount += additionalAmount;
    this.markAsUpdated();
  }

  public spendAmount(amount: number): void {
    if (amount <= 0) {
      throw new BusinessRuleViolationException(
        'INVALID_SPEND_AMOUNT',
        'Spend amount must be greater than zero.',
      );
    }
    if (this._spentAmount + amount > this._allocatedAmount) {
      throw new BusinessRuleViolationException(
        'BUDGET_EXCEEDED',
        'Cannot spend more than allocated budget.',
      );
    }
    this._spentAmount += amount;
    this.markAsUpdated();
  }

  public refundAmount(amount: number): void {
    if (amount <= 0) {
      throw new BusinessRuleViolationException(
        'INVALID_REFUND_AMOUNT',
        'Refund amount must be greater than zero.',
      );
    }
    if (amount > this._spentAmount) {
      throw new BusinessRuleViolationException(
        'INVALID_REFUND',
        'Cannot refund more than spent amount.',
      );
    }
    this._spentAmount -= amount;
    this.markAsUpdated();
  }

  public updateStatus(newStatus: BudgetStatus): void {
    this.validateStatusTransition(newStatus);
    this._status = newStatus;
    this.markAsUpdated();
  }

  public approve(): void {
    if (this._status === BudgetStatus.APPROVED) {
      throw new BusinessRuleViolationException(
        'ALREADY_APPROVED',
        'Budget plan is already approved.',
      );
    }
    if (this._status === BudgetStatus.REJECTED) {
      throw new BusinessRuleViolationException(
        'CANNOT_APPROVE_REJECTED',
        'Cannot approve a rejected budget plan.',
      );
    }
    this._status = BudgetStatus.APPROVED;
    this.markAsUpdated();
  }

  public reject(): void {
    if (this._status === BudgetStatus.REJECTED) {
      throw new BusinessRuleViolationException(
        'ALREADY_REJECTED',
        'Budget plan is already rejected.',
      );
    }
    if (this._status === BudgetStatus.APPROVED) {
      throw new BusinessRuleViolationException(
        'CANNOT_REJECT_APPROVED',
        'Cannot reject an approved budget plan.',
      );
    }
    this._status = BudgetStatus.REJECTED;
    this.markAsUpdated();
  }

  public close(): void {
    if (this._status === BudgetStatus.CLOSED) {
      throw new BusinessRuleViolationException(
        'ALREADY_CLOSED',
        'Budget plan is already closed.',
      );
    }
    this._status = BudgetStatus.CLOSED;
    this.markAsUpdated();
  }

  public cancel(): void {
    if (this._status === BudgetStatus.CLOSED) {
      throw new BusinessRuleViolationException(
        'CANNOT_CANCEL_CLOSED',
        'Cannot cancel a closed budget plan.',
      );
    }
    this._status = BudgetStatus.CANCELLED;
    this.markAsUpdated();
  }

  // Validation methods
  private validateAllocatedAmount(amount: number): void {
    if (amount < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_ALLOCATED_AMOUNT',
        'Allocated amount cannot be negative.',
      );
    }
  }

  private validateFiscalYear(year: number): void {
    const currentYear = new Date().getFullYear();
    if (year < currentYear - 10 || year > currentYear + 10) {
      throw new BusinessRuleViolationException(
        'INVALID_FISCAL_YEAR',
        `Fiscal year must be within ${currentYear - 10} and ${currentYear + 10}.`,
      );
    }
  }

  private validateStatusTransition(newStatus: BudgetStatus): void {
    const allowedTransitions: Record<BudgetStatus, BudgetStatus[]> = {
      [BudgetStatus.DRAFT]: [BudgetStatus.SUBMITTED, BudgetStatus.CANCELLED],
      [BudgetStatus.SUBMITTED]: [
        BudgetStatus.APPROVED,
        BudgetStatus.REJECTED,
        BudgetStatus.DRAFT,
      ],
      [BudgetStatus.APPROVED]: [BudgetStatus.ACTIVE, BudgetStatus.CANCELLED],
      [BudgetStatus.ACTIVE]: [BudgetStatus.CLOSED, BudgetStatus.INACTIVE],
      [BudgetStatus.INACTIVE]: [BudgetStatus.ACTIVE, BudgetStatus.CLOSED],
      [BudgetStatus.CLOSED]: [BudgetStatus.ARCHIVED],
      [BudgetStatus.CANCELLED]: [BudgetStatus.DRAFT],
      [BudgetStatus.ARCHIVED]: [],
      [BudgetStatus.REJECTED]: [BudgetStatus.DRAFT],
    };

    if (!allowedTransitions[this._status].includes(newStatus)) {
      throw new BusinessRuleViolationException(
        'INVALID_STATUS_TRANSITION',
        `Cannot transition from ${this._status} to ${newStatus}.`,
      );
    }
  }

  // Helper methods
  public isActive(): boolean {
    return this._status === BudgetStatus.ACTIVE;
  }

  public isClosed(): boolean {
    return this._status === BudgetStatus.CLOSED;
  }

  public isApproved(): boolean {
    return this._status === BudgetStatus.APPROVED;
  }

  public isRejected(): boolean {
    return this._status === BudgetStatus.REJECTED;
  }

  public isDraft(): boolean {
    return this._status === BudgetStatus.DRAFT;
  }

  public isSubmitted(): boolean {
    return this._status === BudgetStatus.SUBMITTED;
  }

  public hasRemainingBudget(): boolean {
    return this.remainingBudget > 0;
  }

  public isOverBudget(): boolean {
    return this._spentAmount > this._allocatedAmount;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    organizationId: string,
    departmentId: string,
    fiscalYear: number,
    budgetType: BudgetType,
    allocatedAmount: number,
  ): BudgetPlanBuilder {
    return new BudgetPlanBuilder(
      id,
      organizationId,
      departmentId,
      fiscalYear,
      budgetType,
      allocatedAmount,
    );
  }

  public static createFromBuilder(builder: BudgetPlanBuilder): BudgetPlan {
    return new BudgetPlan(builder);
  }
}

export class BudgetPlanBuilder {
  public spentAmount: number = 0;
  public status: BudgetStatus = BudgetStatus.DRAFT;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly departmentId: string,
    public readonly fiscalYear: number,
    public readonly budgetType: BudgetType,
    public allocatedAmount: number,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public withSpentAmount(amount: number): this {
    this.spentAmount = amount;
    return this;
  }

  public withStatus(status: BudgetStatus): this {
    this.status = status;
    return this;
  }

  public withAllocatedAmount(amount: number): this {
    this.allocatedAmount = amount;
    return this;
  }

  public withTimestamps(createdAt: Date, updatedAt: Date): this {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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

    if (this.allocatedAmount < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_ALLOCATED_AMOUNT',
        'Allocated amount cannot be negative.',
      );
    }

    if (this.spentAmount < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_SPENT_AMOUNT',
        'Spent amount cannot be negative.',
      );
    }

    if (this.spentAmount > this.allocatedAmount) {
      throw new BusinessRuleViolationException(
        'SPENT_EXCEEDS_ALLOCATED',
        'Spent amount cannot exceed allocated amount.',
      );
    }

    const currentYear = new Date().getFullYear();
    if (
      this.fiscalYear < currentYear - 10 ||
      this.fiscalYear > currentYear + 10
    ) {
      throw new BusinessRuleViolationException(
        'INVALID_FISCAL_YEAR',
        `Fiscal year must be within ${currentYear - 10} and ${currentYear + 10}.`,
      );
    }
  }
}
