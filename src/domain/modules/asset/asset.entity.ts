import { BaseEntity } from '../../core/base/base.entity';
import { BusinessRuleViolationException } from '../../core/exceptions';

export class Asset extends BaseEntity {
  private _organizationId: string;
  private _departmentId: string | null;
  private _name: string;
  private _code: string;

  constructor(
    id: string,
    organizationId: string,
    departmentId: string | null,
    name: string,
    code: string,
  ) {
    super(id);
    this._organizationId = organizationId;
    this._departmentId = departmentId;
    this._name = name;
    this._code = code;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get departmentId(): string | null {
    return this._departmentId;
  }

  get name(): string {
    return this._name;
  }

  get code(): string {
    return this._code;
  }

  public static create(
    id: string,
    organizationId: string,
    departmentId: string | null,
    name: string,
    code: string,
  ): Asset {
    if (!id || !organizationId) {
      throw new BusinessRuleViolationException(
        'ASSET_IDENTITY_REQUIRED',
        'Asset ID and Organization ID are required for creation.',
      );
    }

    if (!name || name.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'Asset_Name_Required',
        'Asset name cannot be empty.',
      );
    }

    if (!code || code.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'Asset_Code_Required',
        'Asset code cannot be empty',
      );
    }

    return new Asset(id, organizationId, departmentId, name, code);
  }

  public rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'ASSET_NAME_REQUIRED',
        'Asset new name is required',
        { newName: newName },
      );
    }
    this._name = newName;
  }

  public transferToDepartment(newDepartmentId: string | null) {
    this._departmentId = newDepartmentId;
  }
}
