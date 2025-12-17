export class AssetCategory {
  private _id: string;
  private _orgId: string;
  private _name: string;
  private _code: string;
  private _parentId: string | null;
  private _children: AssetCategory[];

  // ========== Constructor ===========
  constructor(
    id: string,
    orgId: string,
    name: string,
    code: string,
    parentId: string | null,
    children: AssetCategory[] = [],
  ) {
    this._id = id;
    this._orgId = orgId;
    this._name = name;
    this._code = code;
    this._parentId = parentId;
    this._children = children;
  }

  // ========== Getters ===========
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

  get parentId(): string | null {
    return this._parentId;
  }

  get children(): AssetCategory[] {
    return this._children;
  }

  // ========== Methods ===========
  public static create(
    id: string,
    orgId: string,
    name: string,
    code: string,
    parentId: string | null,
  ): AssetCategory {
    return new AssetCategory(id, orgId, name, code, parentId || null);
  }

  public updateInfo(
    name: string | undefined,
    parent: string | null | undefined,
    children: AssetCategory[] | undefined,
  ): void {
    if (name) {
      this._name = name;
    }
    if (parent !== undefined) {
      this._parentId = parent;
    }
    if (children) {
      this._children = children;
    }
  }

  public addChild(
    ...args: Parameters<typeof AssetCategory.create>
  ): AssetCategory {
    const child = AssetCategory.create(...args);
    this._children.push(child);
    return child;
  }

  public removeChild(childId: string): void {
    this._children = this._children.filter(
      (category) => category.id !== childId,
    );
  }

  public isLeaf(): boolean {
    return this.children.length === 0;
  }
}
