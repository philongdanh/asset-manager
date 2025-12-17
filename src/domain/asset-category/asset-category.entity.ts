export class AssetCategory {
  private _id: string;
  private _orgId: string;
  private _name: string;
  private _code: string;
  private _parentCategoryId: string | null;
  private _properties: Map<string, any>;
  private _subCategories: AssetCategory[];

  constructor(
    id: string,
    orgId: string,
    name: string,
    code: string,
    parentCategoryId: string | null,
    properties: Map<string, any>,
    subCategories: AssetCategory[] = [],
  ) {
    this._id = id;
    this._orgId = orgId;
    this._name = name;
    this._code = code;
    this._parentCategoryId = parentCategoryId;
    this._properties = properties || new Map<string, any>();
    this._subCategories = subCategories;
  }

  get id(): string {
    return this._id;
  }

  get orgId(): string {
    return this._orgId;
  }

  get name(): string {
    return this._name;
  }

  get code(): string {
    return this._code;
  }

  get parentCategoryId(): string | null {
    return this._parentCategoryId;
  }

  get properties(): Map<string, any> {
    return this._properties;
  }

  get subCategories(): AssetCategory[] {
    return this._subCategories;
  }

  public static create(
    id: string,
    orgId: string,
    name: string,
    code: string,
    parentCategoryId: string | null,
    properties: Map<string, any>,
  ): AssetCategory {
    return new AssetCategory(
      id,
      orgId,
      name,
      code,
      parentCategoryId || null,
      properties || new Map<string, any>(),
    );
  }

  public updateInfo(
    name: string | undefined,
    properties: Map<string, any> | undefined,
    parentCategoryId: string | null | undefined,
    subCategories: AssetCategory[] | undefined,
  ): void {
    if (name) {
      this._name = name;
    }
    if (properties) {
      this._properties = properties;
    }
    if (parentCategoryId !== undefined) {
      this._parentCategoryId = parentCategoryId;
    }
    if (subCategories) {
      this._subCategories = subCategories;
    }
  }

  public addSubCategory(assetCategory: AssetCategory): AssetCategory {
    const subCategory = AssetCategory.create(
      assetCategory.id,
      assetCategory.orgId,
      assetCategory.name,
      assetCategory.code,
      assetCategory.parentCategoryId || null,
      assetCategory.properties || new Map<string, any>(),
    );
    this.subCategories.push(subCategory);
    return subCategory;
  }

  public removeSubCategory(assetCategoryId: string): void {
    this._subCategories = this._subCategories.filter(
      (category) => category.id !== assetCategoryId,
    );
  }

  public isLeaf(): boolean {
    return this.subCategories.length === 0;
  }
}
