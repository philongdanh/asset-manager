import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

// --- Enums ---
export enum AccountingEntryType {
  ASSET_PURCHASE = 'ASSET_PURCHASE',
  DEPRECIATION = 'DEPRECIATION',
  DISPOSAL = 'DISPOSAL',
  MAINTENANCE = 'MAINTENANCE',
  REPAIR = 'REPAIR',
  UPGRADE = 'UPGRADE',
  TRANSFER = 'TRANSFER',
  REVALUATION = 'REVALUATION',
  IMPAIRMENT = 'IMPAIRMENT',
  TAX = 'TAX',
  INSURANCE = 'INSURANCE',
  OTHER = 'OTHER',
}

export enum ReferenceType {
  ASSET = 'ASSET',
  DEPRECIATION = 'DEPRECIATION',
  DISPOSAL = 'DISPOSAL',
  MAINTENANCE = 'MAINTENANCE',
  TRANSFER = 'TRANSFER',
  USER = 'USER',
  DEPARTMENT = 'DEPARTMENT',
  CATEGORY = 'CATEGORY',
}

export class AccountingEntry extends BaseEntity {
  private _organizationId: string;
  private _entryType: AccountingEntryType;
  private _entryDate: Date;
  private _amount: number;
  private _description: string | null;
  private _assetId: string | null;
  private _referenceId: string | null;
  private _referenceType: ReferenceType | null;
  private _createdByUserId: string;

  protected constructor(builder: AccountingEntryBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt);
    this._organizationId = builder.organizationId;
    this._entryType = builder.entryType;
    this._entryDate = builder.entryDate;
    this._amount = builder.amount;
    this._description = builder.description;
    this._assetId = builder.assetId;
    this._referenceId = builder.referenceId;
    this._referenceType = builder.referenceType;
    this._createdByUserId = builder.createdByUserId;
  }

  // --- Getters ---
  public get organizationId(): string {
    return this._organizationId;
  }

  public get entryType(): AccountingEntryType {
    return this._entryType;
  }

  public get entryDate(): Date {
    return this._entryDate;
  }

  public get amount(): number {
    return this._amount;
  }

  public get description(): string | null {
    return this._description;
  }

  public get assetId(): string | null {
    return this._assetId;
  }

  public get referenceId(): string | null {
    return this._referenceId;
  }

  public get referenceType(): ReferenceType | null {
    return this._referenceType;
  }

  public get createdByUserId(): string {
    return this._createdByUserId;
  }

  // --- Business Methods ---
  public updateDetails(
    entryDate: Date,
    entryType: AccountingEntryType,
    amount: number,
    description: string | null,
  ): void {
    this.validateEntryDate(entryDate);
    this.validateAmount(amount);

    this._entryDate = entryDate;
    this._entryType = entryType;
    this._amount = amount;
    this._description = description;
    this.markAsUpdated();
  }

  public linkToAsset(assetId: string): void {
    this._assetId = assetId;
    this.markAsUpdated();
  }

  public linkToReference(
    referenceType: ReferenceType,
    referenceId: string,
  ): void {
    this._referenceType = referenceType;
    this._referenceId = referenceId;
    this.markAsUpdated();
  }

  public updateDescription(description: string | null): void {
    this._description = description;
    this.markAsUpdated();
  }

  public updateAmount(newAmount: number): void {
    this.validateAmount(newAmount);
    this._amount = newAmount;
    this.markAsUpdated();
  }

  // Validation methods
  private validateEntryDate(date: Date): void {
    if (date > new Date()) {
      throw new BusinessRuleViolationException(
        'INVALID_ENTRY_DATE',
        'Entry date cannot be in the future.',
      );
    }
  }

  private validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new BusinessRuleViolationException(
        'INVALID_AMOUNT',
        'Accounting entry amount must be greater than zero.',
      );
    }
  }

  // Helper methods
  public isAssetRelated(): boolean {
    return this._assetId !== null;
  }

  public isDepreciationEntry(): boolean {
    return this._entryType === AccountingEntryType.DEPRECIATION;
  }

  public isDisposalEntry(): boolean {
    return this._entryType === AccountingEntryType.DISPOSAL;
  }

  public isPurchaseEntry(): boolean {
    return this._entryType === AccountingEntryType.ASSET_PURCHASE;
  }

  public hasReference(): boolean {
    return this._referenceId !== null && this._referenceType !== null;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    organizationId: string,
    entryType: AccountingEntryType,
    amount: number,
    createdByUserId: string,
  ): AccountingEntryBuilder {
    return new AccountingEntryBuilder(
      id,
      organizationId,
      entryType,
      amount,
      createdByUserId,
    );
  }

  public static createFromBuilder(
    builder: AccountingEntryBuilder,
  ): AccountingEntry {
    return new AccountingEntry(builder);
  }
}

export class AccountingEntryBuilder {
  public entryDate: Date = new Date();
  public description: string | null = null;
  public assetId: string | null = null;
  public referenceId: string | null = null;
  public referenceType: ReferenceType | null = null;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly entryType: AccountingEntryType,
    public readonly amount: number,
    public readonly createdByUserId: string,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public onDate(date: Date): this {
    this.entryDate = date;
    return this;
  }

  public withDescription(description: string | null): this {
    this.description = description;
    return this;
  }

  public forAsset(assetId: string | null): this {
    this.assetId = assetId;
    return this;
  }

  public withReference(
    referenceType: ReferenceType | null,
    referenceId: string | null,
  ): this {
    this.referenceType = referenceType;
    this.referenceId = referenceId;
    return this;
  }

  public withTimestamps(createdAt: Date, updatedAt: Date): this {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    return this;
  }

  public build(): AccountingEntry {
    this.validate();
    return AccountingEntry.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id || !this.organizationId || !this.createdByUserId) {
      throw new BusinessRuleViolationException(
        'ACCOUNTING_REQUIRED_FIELDS',
        'ID, Organization ID, and Created By User ID are mandatory.',
      );
    }

    if (this.amount <= 0) {
      throw new BusinessRuleViolationException(
        'INVALID_AMOUNT',
        'Accounting entry amount must be greater than zero.',
      );
    }

    if (this.entryDate > new Date()) {
      throw new BusinessRuleViolationException(
        'INVALID_ENTRY_DATE',
        'Entry date cannot be in the future.',
      );
    }

    if (
      (this.referenceId && !this.referenceType) ||
      (!this.referenceId && this.referenceType)
    ) {
      throw new BusinessRuleViolationException(
        'INVALID_REFERENCE',
        'Both reference ID and reference type must be provided together, or both must be null.',
      );
    }
  }
}
