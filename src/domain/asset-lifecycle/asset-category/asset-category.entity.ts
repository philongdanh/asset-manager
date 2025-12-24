import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class AssetCategory extends BaseEntity {
  private _organizationId: string;
  private _categoryName: string;
  private _code: string;
  private _parentId: string | null;

  protected constructor(builder: AssetCategoryBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt, builder.deletedAt);
    this._organizationId = builder.organizationId;
    this._categoryName = builder.categoryName;
    this._code = builder.code;
    this._parentId = builder.parentId;
  }

  // --- Getters ---
  public get organizationId(): string {
    return this._organizationId;
  }

  public get categoryName(): string {
    return this._categoryName;
  }

  public get code(): string {
    return this._code;
  }

  public get parentId(): string | null {
    return this._parentId;
  }

  // --- Business Methods ---
  public updateInfo(name: string, code: string): void {
    if (!name || name.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'CATEGORY_NAME_REQUIRED',
        'Category name cannot be empty.',
      );
    }
    if (!code || code.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'CATEGORY_CODE_REQUIRED',
        'Category code cannot be empty.',
      );
    }
    this._categoryName = name;
    this._code = code;
    this.markAsUpdated();
  }

  public changeParent(newParentId: string | null): void {
    if (newParentId === this.id) {
      throw new BusinessRuleViolationException(
        'INVALID_PARENT_CATEGORY',
        'A category cannot be its own parent.',
      );
    }
    this._parentId = newParentId;
    this.markAsUpdated();
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    organizationId: string,
    code: string,
    categoryName: string,
  ): AssetCategoryBuilder {
    return new AssetCategoryBuilder(id, organizationId, code, categoryName);
  }

  // Static factory method
  public static createFromBuilder(
    builder: AssetCategoryBuilder,
  ): AssetCategory {
    return new AssetCategory(builder);
  }
}

export class AssetCategoryBuilder {
  public categoryName: string;
  public parentId: string | null = null;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly code: string,
    categoryName: string,
  ) {
    this.categoryName = categoryName;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public withParent(parentId: string | null): this {
    this.parentId = parentId;
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

  public build(): AssetCategory {
    this.validate();
    return AssetCategory.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id) {
      throw new BusinessRuleViolationException(
        'CATEGORY_ID_REQUIRED',
        'Category ID is mandatory.',
      );
    }
    if (!this.organizationId) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_ID_REQUIRED',
        'Organization ID is mandatory for asset category.',
      );
    }
    if (!this.code || this.code.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'CATEGORY_CODE_INVALID',
        'Category code cannot be empty.',
      );
    }
    if (!this.categoryName || this.categoryName.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'CATEGORY_NAME_INVALID',
        'Category name cannot be empty.',
      );
    }
    if (this.parentId === this.id) {
      throw new BusinessRuleViolationException(
        'SELF_PARENT_NOT_ALLOWED',
        'Category cannot be its own parent.',
      );
    }
  }
}
