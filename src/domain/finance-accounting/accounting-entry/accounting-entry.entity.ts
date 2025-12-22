import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class AccountingEntry extends BaseEntity {
  private _organizationId: string;
  private _assetId: string | null;
  private _entryDate: Date;
  private _description: string;
  private _debitAccount: string;
  private _creditAccount: string;
  private _amount: number;
  private _referenceType: string | null; // e.g., 'DEPRECIATION', 'DISPOSAL', 'PURCHASE'
  private _referenceId: string | null;

  protected constructor(builder: AccountingEntryBuilder) {
    super(builder.id);
    this._organizationId = builder.organizationId;
    this._assetId = builder.assetId;
    this._entryDate = builder.entryDate;
    this._description = builder.description;
    this._debitAccount = builder.debitAccount;
    this._creditAccount = builder.creditAccount;
    this._amount = builder.amount;
    this._referenceType = builder.referenceType;
    this._referenceId = builder.referenceId;
  }

  // --- Getters ---
  public get organizationId(): string {
    return this._organizationId;
  }

  public get assetId(): string | null {
    return this._assetId;
  }

  public get entryDate(): Date {
    return this._entryDate;
  }

  public get description(): string {
    return this._description;
  }

  public get debitAccount(): string {
    return this._debitAccount;
  }

  public get creditAccount(): string {
    return this._creditAccount;
  }

  public get amount(): number {
    return this._amount;
  }

  public get referenceType(): string | null {
    return this._referenceType;
  }

  public get referenceId(): string | null {
    return this._referenceId;
  }

  // --- Business Methods ---
  public updateDescription(newDescription: string): void {
    if (!newDescription || newDescription.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'DESCRIPTION_REQUIRED',
        'Entry description cannot be empty.',
      );
    }
    this._description = newDescription;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    organizationId: string,
    amount: number,
    description: string,
  ): AccountingEntryBuilder {
    return new AccountingEntryBuilder(id, organizationId, amount, description);
  }

  public static createFromBuilder(
    builder: AccountingEntryBuilder,
  ): AccountingEntry {
    return new AccountingEntry(builder);
  }
}

export class AccountingEntryBuilder {
  public readonly id: string;
  public readonly organizationId: string;
  public amount: number;
  public description: string;
  public assetId: string | null = null;
  public entryDate: Date = new Date();
  public debitAccount: string;
  public creditAccount: string;
  public referenceType: string | null = null;
  public referenceId: string | null = null;

  constructor(
    id: string,
    organizationId: string,
    amount: number,
    description: string,
  ) {
    this.id = id;
    this.organizationId = organizationId;
    this.amount = amount;
    this.description = description;
  }

  public withAccounts(debit: string, credit: string): this {
    this.debitAccount = debit;
    this.creditAccount = credit;
    return this;
  }

  public forAsset(assetId: string | null): this {
    this.assetId = assetId;
    return this;
  }

  public withReference(type: string, id: string): this {
    this.referenceType = type;
    this.referenceId = id;
    return this;
  }

  public onDate(date: Date): this {
    this.entryDate = date;
    return this;
  }

  public build(): AccountingEntry {
    this.validate();
    return AccountingEntry.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id || !this.organizationId) {
      throw new BusinessRuleViolationException(
        'ACCOUNTING_REQUIRED_IDS',
        'ID and Organization ID are mandatory.',
      );
    }
    if (this.amount <= 0) {
      throw new BusinessRuleViolationException(
        'INVALID_AMOUNT',
        'Accounting entry amount must be greater than zero.',
      );
    }
    if (!this.debitAccount || !this.creditAccount) {
      throw new BusinessRuleViolationException(
        'ACCOUNTS_REQUIRED',
        'Both Debit and Credit accounts must be specified.',
      );
    }
  }
}
