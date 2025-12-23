import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class Asset extends BaseEntity {
  private _organizationId: string;
  private _categoryId: string;
  private _createdByUserId: string;
  private _assetName: string;
  private _assetCode: string;
  private _purchasePrice: number;
  private _originalCost: number;
  private _currentValue: number;
  private _status: string;
  private _currentDepartmentId: string | null;
  private _currentUserId: string | null;
  private _model: string | null;
  private _serialNumber: string | null;
  private _manufacturer: string | null;
  private _purchaseDate: Date | null;
  private _warrantyExpiryDate: Date | null;
  private _location: string | null;
  private _specifications: string | null;
  private _condition: string | null;

  protected constructor(builder: AssetBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt, builder.deletedAt);
    this._organizationId = builder.organizationId;
    this._categoryId = builder.categoryId;
    this._createdByUserId = builder.createdByUserId;
    this._assetName = builder.assetName;
    this._assetCode = builder.assetCode;
    this._purchasePrice = builder.purchasePrice;
    this._originalCost = builder.originalCost;
    this._currentValue = builder.currentValue;
    this._status = builder.status;
    this._currentDepartmentId = builder.currentDepartmentId;
    this._currentUserId = builder.currentUserId;
    this._model = builder.model;
    this._serialNumber = builder.serialNumber;
    this._manufacturer = builder.manufacturer;
    this._purchaseDate = builder.purchaseDate;
    this._warrantyExpiryDate = builder.warrantyExpiryDate;
    this._location = builder.location;
    this._specifications = builder.specifications;
    this._condition = builder.condition;
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

  public get originalCost(): number {
    return this._originalCost;
  }

  public get currentValue(): number {
    return this._currentValue;
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

  // --- Business Methods for Updating ---

  public updateBasicInfo(name: string, categoryId: string): void {
    if (!name || name.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'NAME_REQUIRED',
        'Asset name cannot be empty.',
      );
    }
    this._assetName = name;
    this._categoryId = categoryId;
    this.markAsUpdated();
  }

  public updateTechnicalDetails(
    model: string | null,
    serialNumber: string | null,
    manufacturer: string | null,
  ): void {
    this._model = model;
    this._serialNumber = serialNumber;
    this._manufacturer = manufacturer;
    this.markAsUpdated();
  }

  public updateFinancials(
    price: number,
    originalCost: number,
    currentValue: number,
    purchaseDate: Date | null,
    warrantyDate: Date | null,
  ): void {
    if (price < 0 || originalCost < 0 || currentValue < 0)
      throw new BusinessRuleViolationException(
        'INVALID_FINANCIAL_VALUE',
        'Financial values cannot be negative.',
      );
    if (purchaseDate && purchaseDate > new Date()) {
      throw new BusinessRuleViolationException(
        'INVALID_PURCHASE_DATE',
        'Purchase date cannot be in the future.',
      );
    }
    if (purchaseDate && warrantyDate && warrantyDate <= purchaseDate) {
      throw new BusinessRuleViolationException(
        'INVALID_WARRANTY_DATE',
        'Warranty must be after purchase date.',
      );
    }
    this._purchasePrice = price;
    this._originalCost = originalCost;
    this._currentValue = currentValue;
    this._purchaseDate = purchaseDate;
    this._warrantyExpiryDate = warrantyDate;
    this.markAsUpdated();
  }

  public updatePhysicalCondition(
    condition: string | null,
    location: string | null,
    specifications: string | null,
  ): void {
    const validConditions = ['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'BROKEN'];
    if (condition && !validConditions.includes(condition)) {
      throw new BusinessRuleViolationException(
        'INVALID_CONDITION',
        `Condition must be one of: ${validConditions.join(', ')}`,
      );
    }
    this._condition = condition;
    this._location = location;
    this._specifications = specifications;
    this.markAsUpdated();
  }

  public changeStatus(newStatus: string): void {
    const validStatuses = [
      'AVAILABLE',
      'IN_USE',
      'MAINTENANCE',
      'DISPOSED',
      'LOST',
    ];
    if (!validStatuses.includes(newStatus)) {
      throw new BusinessRuleViolationException(
        'INVALID_STATUS',
        'Invalid asset status.',
      );
    }
    this._status = newStatus;
    this.markAsUpdated();
  }

  public assignToUser(userId: string, departmentId: string): void {
    this._currentUserId = userId;
    this._currentDepartmentId = departmentId;
    this._status = 'IN_USE';
    this.markAsUpdated();
  }

  public unassign(): void {
    this._currentUserId = null;
    this._currentDepartmentId = null;
    this._status = 'AVAILABLE';
    this.markAsUpdated();
  }

  public markAsDeleted(): void {
    super.markAsDeleted();
    this._status = 'DISPOSED';
  }

  // --- Static Factory ---
  public static builder(
    id: string,
    orgId: string,
    code: string,
    name: string,
  ): AssetBuilder {
    return new AssetBuilder(id, orgId, code, name);
  }

  public static createFromBuilder(builder: AssetBuilder): Asset {
    return new Asset(builder);
  }
}

// --- Builder Class ---
export class AssetBuilder {
  public categoryId: string;
  public createdByUserId: string;
  public purchasePrice: number = 0;
  public originalCost: number = 0;
  public currentValue: number = 0;
  public status: string = 'AVAILABLE';
  public currentDepartmentId: string | null = null;
  public currentUserId: string | null = null;
  public model: string | null = null;
  public serialNumber: string | null = null;
  public manufacturer: string | null = null;
  public purchaseDate: Date | null = null;
  public warrantyExpiryDate: Date | null = null;
  public location: string | null = null;
  public specifications: string | null = null;
  public condition: string | null = 'GOOD';
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly assetCode: string,
    public readonly assetName: string,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
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
    this.purchasePrice = price;
    return this;
  }

  public withStatus(status: string): AssetBuilder {
    this.status = status;
    return this;
  }

  public withPurchaseDate(date: Date | null): this {
    this.purchaseDate = date;
    return this;
  }

  public withOriginalCost(cost: number): this {
    this.originalCost = cost;
    return this;
  }

  public withCurrentValue(value: number): this {
    this.currentValue = value;
    return this;
  }

  public withWarrantyExpiryDate(date: Date | null): this {
    this.warrantyExpiryDate = date;
    return this;
  }

  public inDepartment(deptId: string | null): this {
    this.currentDepartmentId = deptId;
    return this;
  }

  public assignedTo(userId: string | null): this {
    this.currentUserId = userId;
    if (userId) this.status = 'IN_USE';
    return this;
  }

  public withLocation(loc: string | null): this {
    this.location = loc;
    return this;
  }

  public withSpecifications(specs: string | null): this {
    this.specifications = specs;
    return this;
  }

  public withModel(model: string | null): this {
    this.model = model;
    return this;
  }

  public withSerialNumber(serialNumber: string | null): this {
    this.serialNumber = serialNumber;
    return this;
  }

  public withManufacturer(manufacturer: string | null): this {
    this.manufacturer = manufacturer;
    return this;
  }

  public withCondition(condition: string | null): this {
    this.condition = condition;
    return this;
  }

  public withTimestamps(
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null,
  ): this {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt || null;
    return this;
  }

  public build(): Asset {
    if (!this.categoryId)
      throw new BusinessRuleViolationException(
        'CATEGORY_REQUIRED',
        'Asset must have a category.',
      );
    if (!this.createdByUserId)
      throw new BusinessRuleViolationException(
        'CREATOR_REQUIRED',
        'Asset creator is required.',
      );
    if (!this.assetName || this.assetName.trim().length === 0)
      throw new BusinessRuleViolationException(
        'NAME_REQUIRED',
        'Asset name cannot be empty.',
      );
    if (!this.assetCode || this.assetCode.trim().length === 0)
      throw new BusinessRuleViolationException(
        'CODE_REQUIRED',
        'Asset code cannot be empty.',
      );
    if (this.purchasePrice < 0)
      throw new BusinessRuleViolationException(
        'INVALID_PRICE',
        'Price cannot be negative.',
      );
    if (this.purchaseDate && this.purchaseDate > new Date())
      throw new BusinessRuleViolationException(
        'INVALID_PURCHASE_DATE',
        'Purchase date cannot be in the future.',
      );
    if (
      this.purchaseDate &&
      this.warrantyExpiryDate &&
      this.warrantyExpiryDate <= this.purchaseDate
    )
      throw new BusinessRuleViolationException(
        'INVALID_WARRANTY_DATE',
        'Warranty must be after purchase date.',
      );
    if (this.originalCost < 0)
      throw new BusinessRuleViolationException(
        'INVALID_COST',
        'Original cost cannot be negative.',
      );
    if (this.originalCost === 0 && this.purchasePrice > 0) {
      this.originalCost = this.purchasePrice;
    }
    if (this.currentValue === 0 && this.purchasePrice > 0) {
      this.currentValue = this.purchasePrice;
    }
    if (this.condition) {
      const validConditions = ['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'BROKEN'];
      if (!validConditions.includes(this.condition)) {
        throw new BusinessRuleViolationException(
          'INVALID_CONDITION',
          `Condition must be one of: ${validConditions.join(', ')}`,
        );
      }
    }

    return Asset.createFromBuilder(this);
  }
}
