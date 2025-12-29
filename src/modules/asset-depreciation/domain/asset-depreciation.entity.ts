import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

// --- Enums ---
export enum DepreciationMethod {
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  DECLINING_BALANCE = 'DECLINING_BALANCE',
  DOUBLE_DECLINING_BALANCE = 'DOUBLE_DECLINING_BALANCE',
  SUM_OF_THE_YEARS_DIGITS = 'SUM_OF_THE_YEARS_DIGITS',
  UNITS_OF_PRODUCTION = 'UNITS_OF_PRODUCTION',
  NONE = 'NONE',
}

export class AssetDepreciation extends BaseEntity {
  private _assetId: string;
  private _organizationId: string;
  private _depreciationDate: Date;
  private _method: DepreciationMethod;
  private _depreciationValue: number;
  private _accumulatedDepreciation: number;
  private _remainingValue: number;
  private _accountingEntryId: string | null;

  protected constructor(builder: AssetDepreciationBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt);
    this._assetId = builder.assetId;
    this._organizationId = builder.organizationId;
    this._depreciationDate = builder.depreciationDate;
    this._method = builder.method;
    this._depreciationValue = builder.depreciationValue;
    this._accumulatedDepreciation = builder.accumulatedDepreciation;
    this._remainingValue = builder.remainingValue;
    this._accountingEntryId = builder.accountingEntryId;
  }

  // --- Getters ---
  public get assetId(): string {
    return this._assetId;
  }

  public get organizationId(): string {
    return this._organizationId;
  }

  public get depreciationDate(): Date {
    return this._depreciationDate;
  }

  public get method(): DepreciationMethod {
    return this._method;
  }

  public get depreciationValue(): number {
    return this._depreciationValue;
  }

  public get accumulatedDepreciation(): number {
    return this._accumulatedDepreciation;
  }

  public get remainingValue(): number {
    return this._remainingValue;
  }

  public get accountingEntryId(): string | null {
    return this._accountingEntryId;
  }

  // --- Business Methods ---
  public updateDepreciationDetails(
    depreciationDate: Date,
    method: DepreciationMethod,
    depreciationValue: number,
    accumulatedDepreciation: number,
    remainingValue: number,
  ): void {
    this.validateDepreciationDate(depreciationDate);
    this.validateFinancialValues(
      depreciationValue,
      accumulatedDepreciation,
      remainingValue,
    );

    this._depreciationDate = depreciationDate;
    this._method = method;
    this._depreciationValue = depreciationValue;
    this._accumulatedDepreciation = accumulatedDepreciation;
    this._remainingValue = remainingValue;
    this.markAsUpdated();
  }

  public recalculate(
    newDepreciationValue: number,
    totalAccumulatedDepreciation: number,
    newRemainingValue: number,
  ): void {
    this.validateFinancialValues(
      newDepreciationValue,
      totalAccumulatedDepreciation,
      newRemainingValue,
    );

    this._depreciationValue = newDepreciationValue;
    this._accumulatedDepreciation = totalAccumulatedDepreciation;
    this._remainingValue = newRemainingValue;
    this.markAsUpdated();
  }

  public linkAccountingEntry(accountingEntryId: string): void {
    if (this._accountingEntryId) {
      throw new BusinessRuleViolationException(
        'ACCOUNTING_ENTRY_ALREADY_LINKED',
        'Accounting entry is already linked to this depreciation.',
      );
    }
    this._accountingEntryId = accountingEntryId;
    this.markAsUpdated();
  }

  public unlinkAccountingEntry(): void {
    this._accountingEntryId = null;
    this.markAsUpdated();
  }

  // Validation methods
  private validateDepreciationDate(date: Date): void {
    if (date > new Date()) {
      throw new BusinessRuleViolationException(
        'INVALID_DEPRECIATION_DATE',
        'Depreciation date cannot be in the future.',
      );
    }
  }

  private validateFinancialValues(
    depreciationValue: number,
    accumulatedDepreciation: number,
    remainingValue: number,
  ): void {
    if (
      depreciationValue < 0 ||
      accumulatedDepreciation < 0 ||
      remainingValue < 0
    ) {
      throw new BusinessRuleViolationException(
        'INVALID_FINANCIAL_VALUES',
        'Depreciation values cannot be negative.',
      );
    }

    if (remainingValue < 0) {
      throw new BusinessRuleViolationException(
        'NEGATIVE_REMAINING_VALUE',
        'Remaining value cannot be negative.',
      );
    }
  }

  // Helper methods
  public calculateDepreciationRate(assetLife: number): number {
    if (assetLife <= 0) {
      throw new BusinessRuleViolationException(
        'INVALID_ASSET_LIFE',
        'Asset life must be greater than zero.',
      );
    }

    switch (this._method) {
      case DepreciationMethod.STRAIGHT_LINE:
        return 1 / assetLife;
      case DepreciationMethod.DOUBLE_DECLINING_BALANCE:
        return 2 / assetLife;
      default:
        return 0;
    }
  }

  public isStraightLine(): boolean {
    return this._method === DepreciationMethod.STRAIGHT_LINE;
  }

  public isDecliningBalance(): boolean {
    return this._method === DepreciationMethod.DECLINING_BALANCE;
  }

  public isDoubleDecliningBalance(): boolean {
    return this._method === DepreciationMethod.DOUBLE_DECLINING_BALANCE;
  }

  public isLinkedToAccounting(): boolean {
    return this._accountingEntryId !== null;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    assetId: string,
    organizationId: string,
    method: DepreciationMethod,
  ): AssetDepreciationBuilder {
    return new AssetDepreciationBuilder(id, assetId, organizationId, method);
  }

  public static createFromBuilder(
    builder: AssetDepreciationBuilder,
  ): AssetDepreciation {
    return new AssetDepreciation(builder);
  }
}

export class AssetDepreciationBuilder {
  public depreciationDate: Date = new Date();
  public depreciationValue: number = 0;
  public accumulatedDepreciation: number = 0;
  public remainingValue: number = 0;
  public accountingEntryId: string | null = null;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    public readonly id: string,
    public readonly assetId: string,
    public readonly organizationId: string,
    public readonly method: DepreciationMethod,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public atDate(date: Date): this {
    this.depreciationDate = date;
    return this;
  }

  public withValues(
    depreciationValue: number,
    accumulatedDepreciation: number,
    remainingValue: number,
  ): this {
    this.depreciationValue = depreciationValue;
    this.accumulatedDepreciation = accumulatedDepreciation;
    this.remainingValue = remainingValue;
    return this;
  }

  public withAccountingEntry(accountingEntryId: string | null): this {
    this.accountingEntryId = accountingEntryId;
    return this;
  }

  public withTimestamps(createdAt: Date, updatedAt: Date): this {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    return this;
  }

  public build(): AssetDepreciation {
    this.validate();
    return AssetDepreciation.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id || !this.assetId || !this.organizationId) {
      throw new BusinessRuleViolationException(
        'DEPRECIATION_REQUIRED_FIELDS',
        'ID, Asset ID, and Organization ID are mandatory.',
      );
    }

    if (this.depreciationDate > new Date()) {
      throw new BusinessRuleViolationException(
        'INVALID_DEPRECIATION_DATE',
        'Depreciation date cannot be in the future.',
      );
    }

    if (
      this.depreciationValue < 0 ||
      this.accumulatedDepreciation < 0 ||
      this.remainingValue < 0
    ) {
      throw new BusinessRuleViolationException(
        'INVALID_FINANCIAL_VALUES',
        'Depreciation values cannot be negative.',
      );
    }

    if (this.remainingValue < 0) {
      throw new BusinessRuleViolationException(
        'NEGATIVE_REMAINING_VALUE',
        'Remaining value cannot be negative.',
      );
    }
  }
}
