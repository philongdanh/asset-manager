import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class Asset extends BaseEntity {
  private _organizationId: string;
  private _categoryId: string;
  private _createdByUserId: string;
  private _assetName: string;
  private _assetCode: string;
  private _purchasePrice: number;
  private _status: string;
  private _currentDepartmentId: string | null;
  private _currentUserId: string | null;
  private _model: string | null;
  private _serialNumber: string | null;
  private _manufacturer: string | null;
  private _purchaseDate: Date | null;
  private _originalCost: number;
  private _currentValue: number;
  private _warrantyExpiryDate: Date | null;
  private _location: string | null;
  private _specifications: string | null;
  private _condition: string | null;

  protected constructor(builder: AssetBuilder) {
    super(builder.id);
    this._organizationId = builder.organizationId;
    this._categoryId = builder.categoryId;
    this._createdByUserId = builder.createdByUserId;
    this._assetName = builder.assetName;
    this._assetCode = builder.assetCode;
    this._purchasePrice = builder.purchasePrice;
    this._status = builder.status;
    this._currentDepartmentId = builder.currentDepartmentId;
    this._currentUserId = builder.currentUserId;
    this._model = builder.model;
    this._serialNumber = builder.serialNumber;
    this._manufacturer = builder.manufacturer;
    this._purchaseDate = builder.purchaseDate;
    this._originalCost = builder.originalCost ?? builder.purchasePrice;
    this._currentValue = builder.currentValue ?? builder.purchasePrice;
    this._warrantyExpiryDate = builder.warrantyExpiryDate;
    this._location = builder.location;
    this._specifications = builder.specifications;
    this._condition = builder.condition;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    organizationId: string,
    assetCode: string,
    assetName: string,
  ): AssetBuilder {
    return new AssetBuilder(id, organizationId, assetCode, assetName);
  }

  // Static factory method
  public static createFromBuilder(builder: AssetBuilder): Asset {
    return new Asset(builder);
  }

  // --- Getters ---
  public get organizationId(): string {
    return this._organizationId;
  }

  public get categoryId(): string {
    return this._categoryId;
  }

  public get createdByUserId(): string {
    return this._createdByUserId;
  }

  public get assetName(): string {
    return this._assetName;
  }

  public get assetCode(): string {
    return this._assetCode;
  }

  public get purchasePrice(): number {
    return this._purchasePrice;
  }

  public get status(): string {
    return this._status;
  }

  public get currentDepartmentId(): string | null {
    return this._currentDepartmentId;
  }

  public get currentUserId(): string | null {
    return this._currentUserId;
  }

  public get model(): string | null {
    return this._model;
  }

  public get serialNumber(): string | null {
    return this._serialNumber;
  }

  public get manufacturer(): string | null {
    return this._manufacturer;
  }

  public get purchaseDate(): Date | null {
    return this._purchaseDate;
  }

  public get originalCost(): number {
    return this._originalCost;
  }

  public get currentValue(): number {
    return this._currentValue;
  }

  public get warrantyExpiryDate(): Date | null {
    return this._warrantyExpiryDate;
  }

  public get location(): string | null {
    return this._location;
  }

  public get specifications(): string | null {
    return this._specifications;
  }

  public get condition(): string | null {
    return this._condition;
  }

  // --- Business Methods ---
  public assignToUser(userId: string, departmentId: string): void {
    this._currentUserId = userId;
    this._currentDepartmentId = departmentId;
    this._status = 'IN_USE';
  }

  public unassign(): void {
    this._currentUserId = null;
    this._currentDepartmentId = null;
    this._status = 'AVAILABLE';
  }

  public updateDepreciation(currentValue: number): void {
    if (currentValue < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_CURRENT_VALUE',
        'Current value cannot be negative.',
      );
    }
    this._currentValue = currentValue;
  }

  public updateCondition(condition: string): void {
    const validConditions = ['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DAMAGED'];
    if (!validConditions.includes(condition)) {
      throw new BusinessRuleViolationException(
        'INVALID_CONDITION',
        `Condition must be one of: ${validConditions.join(', ')}`,
      );
    }
    this._condition = condition;
  }
}

export class AssetBuilder {
  public readonly id: string;
  public readonly organizationId: string;
  public readonly assetCode: string;
  public readonly assetName: string;
  public categoryId: string = '';
  public createdByUserId: string = '';
  public purchasePrice: number = 0;
  public status: string = 'ACTIVE';
  public currentDepartmentId: string | null = null;
  public currentUserId: string | null = null;
  public model: string | null = null;
  public serialNumber: string | null = null;
  public manufacturer: string | null = null;
  public purchaseDate: Date | null = null;
  public originalCost: number | null = null;
  public currentValue: number | null = null;
  public warrantyExpiryDate: Date | null = null;
  public location: string | null = null;
  public specifications: string | null = null;
  public condition: string | null = null;

  constructor(
    id: string,
    organizationId: string,
    assetCode: string,
    assetName: string,
  ) {
    this.id = id;
    this.organizationId = organizationId;
    this.assetCode = assetCode;
    this.assetName = assetName;
  }

  public withCategory(categoryId: string): this {
    this.categoryId = categoryId;
    return this;
  }

  public createdBy(userId: string): this {
    this.createdByUserId = userId;
    return this;
  }

  public withPrice(price: number): this {
    if (price < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_PRICE',
        'Purchase price cannot be negative.',
      );
    }
    this.purchasePrice = price;
    return this;
  }

  public withStatus(status: string): this {
    const validStatuses = [
      'ACTIVE',
      'INACTIVE',
      'IN_USE',
      'AVAILABLE',
      'UNDER_MAINTENANCE',
      'DISPOSED',
    ];
    if (!validStatuses.includes(status)) {
      throw new BusinessRuleViolationException(
        'INVALID_STATUS',
        `Status must be one of: ${validStatuses.join(', ')}`,
      );
    }
    this.status = status;
    return this;
  }

  public inDepartment(deptId: string | null): this {
    this.currentDepartmentId = deptId;
    return this;
  }

  public assignedTo(userId: string | null): this {
    this.currentUserId = userId;
    return this;
  }

  public withTechnicalDetails(model: string | null, sn: string | null): this {
    this.model = model;
    this.serialNumber = sn;
    return this;
  }

  public withManufacturer(manufacturer: string | null): this {
    this.manufacturer = manufacturer;
    return this;
  }

  public withPurchaseDate(date: Date | null): this {
    this.purchaseDate = date;
    return this;
  }

  public withOriginalCost(cost: number | null): this {
    if (cost !== null && cost < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_COST',
        'Original cost cannot be negative.',
      );
    }
    this.originalCost = cost;
    return this;
  }

  public withCurrentValue(value: number | null): this {
    if (value !== null && value < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_VALUE',
        'Current value cannot be negative.',
      );
    }
    this.currentValue = value;
    return this;
  }

  public withWarrantyExpiry(date: Date | null): this {
    this.warrantyExpiryDate = date;
    return this;
  }

  public withLocation(location: string | null): this {
    this.location = location;
    return this;
  }

  public withSpecifications(specs: string | null): this {
    this.specifications = specs;
    return this;
  }

  public withCondition(condition: string | null): this {
    if (condition !== null) {
      const validConditions = ['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DAMAGED'];
      if (!validConditions.includes(condition)) {
        throw new BusinessRuleViolationException(
          'INVALID_CONDITION',
          `Condition must be one of: ${validConditions.join(', ')}`,
        );
      }
    }
    this.condition = condition;
    return this;
  }

  public build(): Asset {
    this.validate();
    return Asset.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.categoryId) {
      throw new BusinessRuleViolationException(
        'CATEGORY_REQUIRED',
        'Asset must belong to a category.',
      );
    }
    if (!this.createdByUserId) {
      throw new BusinessRuleViolationException(
        'CREATOR_REQUIRED',
        'Asset creator is required.',
      );
    }
    if (this.purchasePrice < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_PRICE',
        'Purchase price cannot be negative.',
      );
    }
    // Validate purchase date is not in the future
    if (this.purchaseDate && this.purchaseDate > new Date()) {
      throw new BusinessRuleViolationException(
        'INVALID_PURCHASE_DATE',
        'Purchase date cannot be in the future.',
      );
    }
    // Validate warranty expiry date is after purchase date
    if (
      this.purchaseDate &&
      this.warrantyExpiryDate &&
      this.warrantyExpiryDate <= this.purchaseDate
    ) {
      throw new BusinessRuleViolationException(
        'INVALID_WARRANTY_DATE',
        'Warranty expiry date must be after purchase date.',
      );
    }
  }
}
