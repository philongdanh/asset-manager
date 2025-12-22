import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class AssetDepreciation extends BaseEntity {
  private _assetId: string;
  private _organizationId: string;
  private _depreciationDate: Date;
  private _depreciationAmount: number;
  private _accumulatedDepreciation: number;
  private _remainingValue: number;
  private _period: string;

  protected constructor(builder: AssetDepreciationBuilder) {
    super(builder.id);
    this._assetId = builder.assetId;
    this._organizationId = builder.organizationId;
    this._depreciationDate = builder.depreciationDate;
    this._depreciationAmount = builder.depreciationAmount;
    this._accumulatedDepreciation = builder.accumulatedDepreciation;
    this._remainingValue = builder.remainingValue;
    this._period = builder.period;
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

  public get depreciationAmount(): number {
    return this._depreciationAmount;
  }

  public get accumulatedDepreciation(): number {
    return this._accumulatedDepreciation;
  }

  public get remainingValue(): number {
    return this._remainingValue;
  }

  public get period(): string {
    return this._period;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    assetId: string,
    organizationId: string,
  ): AssetDepreciationBuilder {
    return new AssetDepreciationBuilder(id, assetId, organizationId);
  }

  // Static factory method
  public static createFromBuilder(
    builder: AssetDepreciationBuilder,
  ): AssetDepreciation {
    return new AssetDepreciation(builder);
  }
}

export class AssetDepreciationBuilder {
  public readonly id: string;
  public readonly assetId: string;
  public readonly organizationId: string;
  public depreciationDate: Date = new Date();
  public depreciationAmount: number = 0;
  public accumulatedDepreciation: number = 0;
  public remainingValue: number = 0;
  public period: string;

  constructor(id: string, assetId: string, organizationId: string) {
    this.id = id;
    this.assetId = assetId;
    this.organizationId = organizationId;
  }

  public withAmount(amount: number): this {
    this.depreciationAmount = amount;
    return this;
  }

  public withAccumulated(accumulated: number): this {
    this.accumulatedDepreciation = accumulated;
    return this;
  }

  public withRemainingValue(value: number): this {
    this.remainingValue = value;
    return this;
  }

  public forPeriod(period: string): this {
    this.period = period;
    return this;
  }

  public atDate(date: Date): this {
    this.depreciationDate = date;
    return this;
  }

  public build(): AssetDepreciation {
    this.validate();
    return AssetDepreciation.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id) {
      throw new BusinessRuleViolationException(
        'DEPRECIATION_ID_REQUIRED',
        'ID is mandatory for asset depreciation.',
      );
    }
    if (!this.assetId) {
      throw new BusinessRuleViolationException(
        'ASSET_ID_REQUIRED',
        'Asset ID is mandatory for depreciation entry.',
      );
    }
    if (this.depreciationAmount < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_DEPRECIATION_AMOUNT',
        'Depreciation amount cannot be negative.',
      );
    }
    if (!this.period || this.period.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'PERIOD_REQUIRED',
        'Depreciation period is required.',
      );
    }
  }
}
