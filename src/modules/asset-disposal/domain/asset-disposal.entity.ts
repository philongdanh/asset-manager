import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

// --- Enums ---
export enum AssetDisposalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum AssetDisposalType {
  SALE = 'SALE',
  DONATION = 'DONATION',
  SCRAP = 'SCRAP',
  LOST = 'LOST',
  DAMAGED = 'DAMAGED',
  OTHER = 'OTHER',
}

export class AssetDisposal extends BaseEntity {
  private _assetId: string;
  private _organizationId: string;
  private _disposalDate: Date;
  private _disposalType: AssetDisposalType;
  private _disposalValue: number;
  private _reason: string | null;
  private _approvedByUserId: string | null;
  private _status: AssetDisposalStatus;
  private _accountingEntryId: string | null;

  protected constructor(builder: AssetDisposalBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt);
    this._assetId = builder.assetId;
    this._organizationId = builder.organizationId;
    this._disposalDate = builder.disposalDate;
    this._disposalType = builder.disposalType;
    this._disposalValue = builder.disposalValue;
    this._reason = builder.reason;
    this._approvedByUserId = builder.approvedByUserId;
    this._status = builder.status;
    this._accountingEntryId = builder.accountingEntryId;
  }

  // --- Getters ---
  public get assetId(): string {
    return this._assetId;
  }

  public get organizationId(): string {
    return this._organizationId;
  }

  public get disposalDate(): Date {
    return this._disposalDate;
  }

  public get disposalType(): AssetDisposalType {
    return this._disposalType;
  }

  public get disposalValue(): number {
    return this._disposalValue;
  }

  public get reason(): string | null {
    return this._reason;
  }

  public get approvedByUserId(): string | null {
    return this._approvedByUserId;
  }

  public get status(): AssetDisposalStatus {
    return this._status;
  }

  public get accountingEntryId(): string | null {
    return this._accountingEntryId;
  }

  // --- Business Methods ---
  public updateDetails(
    disposalDate: Date,
    disposalType: AssetDisposalType,
    disposalValue: number,
    reason: string | null,
  ): void {
    this.validateDisposalDate(disposalDate);
    this.validateDisposalValue(disposalValue);

    this._disposalDate = disposalDate;
    this._disposalType = disposalType;
    this._disposalValue = disposalValue;
    this._reason = reason;
    this.markAsUpdated();
  }

  public approve(approvedByUserId: string): void {
    if (this._status === AssetDisposalStatus.APPROVED) {
      throw new BusinessRuleViolationException(
        'ALREADY_APPROVED',
        'Disposal is already approved.',
      );
    }
    if (this._status === AssetDisposalStatus.REJECTED) {
      throw new BusinessRuleViolationException(
        'CANNOT_APPROVE_REJECTED',
        'Cannot approve a rejected disposal.',
      );
    }
    this._status = AssetDisposalStatus.APPROVED;
    this._approvedByUserId = approvedByUserId;
    this.markAsUpdated();
  }

  public reject(approvedByUserId: string, reason: string): void {
    if (this._status === AssetDisposalStatus.APPROVED) {
      throw new BusinessRuleViolationException(
        'CANNOT_REJECT_APPROVED',
        'Cannot reject an approved disposal.',
      );
    }
    this._status = AssetDisposalStatus.REJECTED;
    this._approvedByUserId = approvedByUserId;
    this._reason = reason || this._reason;
    this.markAsUpdated();
  }

  public cancel(): void {
    if (this._status === AssetDisposalStatus.APPROVED) {
      throw new BusinessRuleViolationException(
        'CANNOT_CANCEL_APPROVED',
        'Cannot cancel an approved disposal.',
      );
    }
    this._status = AssetDisposalStatus.CANCELLED;
    this.markAsUpdated();
  }

  public linkAccountingEntry(accountingEntryId: string): void {
    if (this._accountingEntryId) {
      throw new BusinessRuleViolationException(
        'ACCOUNTING_ENTRY_ALREADY_LINKED',
        'Accounting entry is already linked to this disposal.',
      );
    }
    this._accountingEntryId = accountingEntryId;
    this.markAsUpdated();
  }

  public calculateNetGainLoss(bookValue: number): number {
    return this._disposalValue - bookValue;
  }

  // Validation methods
  private validateDisposalDate(date: Date): void {
    if (date > new Date()) {
      throw new BusinessRuleViolationException(
        'INVALID_DISPOSAL_DATE',
        'Disposal date cannot be in the future.',
      );
    }
  }

  private validateDisposalValue(value: number): void {
    if (value < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_DISPOSAL_VALUE',
        'Disposal value cannot be negative.',
      );
    }
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    assetId: string,
    organizationId: string,
    disposalType: AssetDisposalType,
  ): AssetDisposalBuilder {
    return new AssetDisposalBuilder(id, assetId, organizationId, disposalType);
  }

  public static createFromBuilder(
    builder: AssetDisposalBuilder,
  ): AssetDisposal {
    return new AssetDisposal(builder);
  }
}

export class AssetDisposalBuilder {
  public disposalDate: Date = new Date();
  public disposalValue: number = 0;
  public reason: string | null = null;
  public approvedByUserId: string | null = null;
  public status: AssetDisposalStatus = AssetDisposalStatus.PENDING;
  public accountingEntryId: string | null = null;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    public readonly id: string,
    public readonly assetId: string,
    public readonly organizationId: string,
    public readonly disposalType: AssetDisposalType,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public atDate(date: Date): this {
    this.disposalDate = date;
    return this;
  }

  public withValue(value: number): this {
    this.disposalValue = value;
    return this;
  }

  public withReason(reason: string | null): this {
    this.reason = reason;
    return this;
  }

  public approvedBy(userId: string | null): this {
    this.approvedByUserId = userId;
    return this;
  }

  public withStatus(status: AssetDisposalStatus): this {
    this.status = status;
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

  public build(): AssetDisposal {
    this.validate();
    return AssetDisposal.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id || !this.assetId || !this.organizationId) {
      throw new BusinessRuleViolationException(
        'DISPOSAL_REQUIRED_FIELDS',
        'ID, Asset ID, and Organization ID are mandatory.',
      );
    }

    if (this.disposalDate > new Date()) {
      throw new BusinessRuleViolationException(
        'INVALID_DISPOSAL_DATE',
        'Disposal date cannot be in the future.',
      );
    }

    if (this.disposalValue < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_DISPOSAL_VALUE',
        'Disposal value cannot be negative.',
      );
    }

    if (
      this.status === AssetDisposalStatus.APPROVED &&
      !this.approvedByUserId
    ) {
      throw new BusinessRuleViolationException(
        'APPROVER_REQUIRED',
        'Approved disposals must have an approver.',
      );
    }
  }
}
