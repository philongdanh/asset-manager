import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class AssetCategory extends BaseEntity {
  private readonly _organizationId: string;
  private readonly _code: string;

  private _name: string;
  private _parentId: string | null;

  constructor(
    id: string,
    organizationId: string,
    name: string,
    code: string,
    parentId: string | null = null,
  ) {
    super(id);
    this._organizationId = organizationId;
    this._name = name;
    this._code = code;
    this._parentId = parentId;
  }

  get organizationId(): string {
    return this._organizationId;
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

  public static create(
    id: string,
    organizationId: string,
    name: string,
    code: string,
    parentId: string | null = null,
  ): AssetCategory {
    if (!id) {
      throw new BusinessRuleViolationException(
        'ID_REQUIRED',
        'ID is mandatory.',
      );
    }

    if (!organizationId) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_ID_REQUIRED',
        'Organization ID is mandatory.',
      );
    }

    if (!name || !name.trim()) {
      throw new BusinessRuleViolationException(
        'CATEGORY_NAME_REQUIRED',
        'Category name cannot be empty.',
      );
    }

    if (!code || !code.trim()) {
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

    return new AssetCategory(id, organizationId, name, code, parentId);
  }

  public rename(newName: string) {
    if (!newName || !newName.trim().length) {
      throw new BusinessRuleViolationException(
        'CATEGORY_NAME_REQUIRED',
        'Name cannot be empty.',
      );
    }
    this._name = newName;
  }

  public transferToParent(newParentId: string | null) {
    this._parentId = newParentId;
  }
}
