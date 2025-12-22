import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class AssetTransfer extends BaseEntity {
  private _assetId: string;
  private _organizationId: string;
  private _fromDepartmentId: string | null;
  private _toDepartmentId: string | null;
  private _fromUserId: string | null;
  private _toUserId: string | null;
  private _transferDate: Date;
  private _reason: string | null;
  private _status: string;

  protected constructor(builder: AssetTransferBuilder) {
    super(builder.id);
    this._assetId = builder.assetId;
    this._organizationId = builder.organizationId;
    this._fromDepartmentId = builder.fromDepartmentId;
    this._toDepartmentId = builder.toDepartmentId;
    this._fromUserId = builder.fromUserId;
    this._toUserId = builder.toUserId;
    this._transferDate = builder.transferDate;
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

  public get fromDepartmentId(): string | null {
    return this._fromDepartmentId;
  }

  public get toDepartmentId(): string | null {
    return this._toDepartmentId;
  }

  public get fromUserId(): string | null {
    return this._fromUserId;
  }

  public get toUserId(): string | null {
    return this._toUserId;
  }

  public get transferDate(): Date {
    return this._transferDate;
  }

  public get reason(): string | null {
    return this._reason;
  }

  public get status(): string {
    return this._status;
  }

  // --- Business Methods ---
  public completeTransfer(): void {
    if (this._status !== 'PENDING') {
      throw new BusinessRuleViolationException(
        'TRANSFER_ALREADY_PROCESSED',
        'Only pending transfers can be completed.',
      );
    }
    this._status = 'COMPLETED';
  }

  public cancelTransfer(reason: string): void {
    this._status = 'CANCELLED';
    this._reason = reason;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    assetId: string,
    organizationId: string,
  ): AssetTransferBuilder {
    return new AssetTransferBuilder(id, assetId, organizationId);
  }

  public static createFromBuilder(
    builder: AssetTransferBuilder,
  ): AssetTransfer {
    return new AssetTransfer(builder);
  }
}

export class AssetTransferBuilder {
  public readonly id: string;
  public readonly assetId: string;
  public readonly organizationId: string;
  public fromDepartmentId: string | null = null;
  public toDepartmentId: string | null = null;
  public fromUserId: string | null = null;
  public toUserId: string | null = null;
  public transferDate: Date = new Date();
  public reason: string | null = null;
  public status: string = 'PENDING';

  constructor(id: string, assetId: string, organizationId: string) {
    this.id = id;
    this.assetId = assetId;
    this.organizationId = organizationId;
  }

  public from(deptId: string | null, userId: string | null): this {
    this.fromDepartmentId = deptId;
    this.fromUserId = userId;
    return this;
  }

  public to(deptId: string | null, userId: string | null): this {
    this.toDepartmentId = deptId;
    this.toUserId = userId;
    return this;
  }

  public withReason(reason: string): this {
    this.reason = reason;
    return this;
  }

  public build(): AssetTransfer {
    this.validate();
    return AssetTransfer.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id || !this.assetId || !this.organizationId) {
      throw new BusinessRuleViolationException(
        'TRANSFER_REQUIRED_FIELDS',
        'ID, Asset ID, and Organization ID are mandatory.',
      );
    }

    if (
      this.fromDepartmentId === this.toDepartmentId &&
      this.fromUserId === this.toUserId
    ) {
      throw new BusinessRuleViolationException(
        'INVALID_TRANSFER_DESTINATION',
        'Source and destination of transfer cannot be the same.',
      );
    }
  }
}
