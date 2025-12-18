import { BaseEntity } from '../../core';
import { BusinessRuleViolationException } from '../../core/exceptions';

export class AssetCategory extends BaseEntity {
  private _orgId: string;
  private _name: string;
  private _code: string;
  private _parentId: string | null;
  private _children: AssetCategory[];

  constructor(
    id: string,
    orgId: string,
    name: string,
    code: string,
    parentId: string | null,
    children: AssetCategory[] = [],
  ) {
    super(id);
    this._orgId = orgId;
    this._name = name;
    this._code = code;
    this._parentId = parentId;
    this._children = children;
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
    return [...this._children]; // Return a copy to protect internal state
  }

  public static create(
    id: string,
    orgId: string,
    name: string,
    code: string,
    parentId: string | null,
  ): AssetCategory {
    if (!name || name.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'CATEGORY_NAME_REQUIRED',
        'Category name cannot be empty.',
      );
    }

    if (!code || code.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'CATEGORY_CODE_REQUIRED',
        'Category code is required for identification.',
      );
    }

    if (parentId && id === parentId) {
      throw new BusinessRuleViolationException(
        'SELF_REFERENCING_NOT_ALLOWED',
        'A category cannot be its own parent.',
        { id, parentId },
      );
    }

    return new AssetCategory(id, orgId, name, code, parentId || null);
  }

  public updateInfo(name?: string, parentId?: string): void {
    if (name !== undefined) {
      if (name.trim().length === 0) {
        throw new BusinessRuleViolationException(
          'CATEGORY_NAME_REQUIRED',
          'Name cannot be empty.',
        );
      }
      this._name = name;
    }

    if (parentId !== undefined) {
      if (parentId === this._id) {
        throw new BusinessRuleViolationException(
          'INVALID_PARENT',
          'Cannot move a category to be a child of itself.',
        );
      }
      this._parentId = parentId;
    }
  }

  public addChild(child: AssetCategory): void {
    if (child.orgId !== this.orgId) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_MISMATCH',
        'Child category must belong to the same organization.',
        { parentOrg: this.orgId, childOrg: child.orgId },
      );
    }

    const isDuplicate = this._children.some(
      (c) => c.id === child.id || c.code === child.code,
    );
    if (isDuplicate) {
      throw new BusinessRuleViolationException(
        'DUPLICATE_CHILD',
        'A child category with this ID or Code already exists in this branch.',
        { childCode: child.code },
      );
    }

    this._children.push(child);
  }

  public removeChild(childId: string): void {
    const exists = this._children.some((c) => c.id === childId);
    if (!exists) {
      throw new BusinessRuleViolationException(
        'CHILD_NOT_FOUND',
        'The category to remove is not a child of this category.',
        { childId },
      );
    }
    this._children = this._children.filter(
      (category) => category.id !== childId,
    );
  }

  public isLeaf(): boolean {
    return this._children.length === 0;
  }
}
