import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class AssetDisposal extends BaseEntity {
  private _assetId: string;
  private _organizationId: string;
  private _disposalDate: Date;
  private _disposalType: string;
  private _disposalPrice: number;
  private _disposalCost: number;
  private _reason: string | null;
  private _status: string;

  protected constructor(builder: AssetDisposalBuilder) {
    super(builder.id);
    this._assetId = builder.assetId;
    this._organizationId = builder.organizationId;
    this._disposalDate = builder.disposalDate;
    this._disposalType = builder.disposalType;
    this._disposalPrice = builder.disposalPrice;
    this._disposalCost = builder.disposalCost;
    this._reason = builder.reason;
    this._status = builder.status;
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

  public get disposalType(): string {
    return this._disposalType;
  }

  public get disposalPrice(): number {
    return this._disposalPrice;
  }

  public get disposalCost(): number {
    return this._disposalCost;
  }

  public get reason(): string | null {
    return this._reason;
  }

  public get status(): string {
    return this._status;
  }

  // --- Business Methods ---
  public approve(): void {
    this._status = 'APPROVED';
  }

  public reject(reason: string): void {
    this._status = 'REJECTED';
    this._reason = reason;
  }

  public calculateNetGainLoss(bookValue: number): number {
    // Thu nhập thuần = Giá thanh lý - Chi phí thanh lý - Giá trị còn lại trên sổ sách
    return this._disposalPrice - this._disposalCost - bookValue;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    assetId: string,
    organizationId: string,
    disposalType: string,
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
  public readonly id: string;
  public readonly assetId: string;
  public readonly organizationId: string;
  public disposalType: string;
  public disposalDate: Date = new Date();
  public disposalPrice: number = 0;
  public disposalCost: number = 0;
  public reason: string | null = null;
  public status: string = 'PENDING';

  constructor(
    id: string,
    assetId: string,
    organizationId: string,
    disposalType: string,
  ) {
    this.id = id;
    this.assetId = assetId;
    this.organizationId = organizationId;
    this.disposalType = disposalType;
  }

  public atDate(date: Date): this {
    this.disposalDate = date;
    return this;
  }

  public withFinancials(price: number, cost: number = 0): this {
    this.disposalPrice = price;
    this.disposalCost = cost;
    return this;
  }

  public withReason(reason: string | null): this {
    this.reason = reason;
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
    if (this.disposalPrice < 0 || this.disposalCost < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_FINANCIAL_VALUES',
        'Price and cost cannot be negative.',
      );
    }
  }
}
