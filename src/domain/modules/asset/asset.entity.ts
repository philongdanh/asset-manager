import { BaseEntity } from '../../core/base/base.entity';
import { BusinessRuleViolationException } from '../../core/exceptions';

export class Asset extends BaseEntity {
  private _orgId: string;
  private _departmentId: string;
  private _name: string;
  private _code: string;

  constructor(id: string, orgId: string, name: string, code: string) {
    super(id);
    this._orgId = orgId;
    this._name = name;
    this._code = code;
  }

  get orgId(): string {
    return this._orgId;
  }

  get departmentId(): string {
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
    orgId: string,
    name: string,
    code: string,
  ): Asset {
    if (!id || !orgId) {
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

    if (!code || code.length < 3) {
      throw new BusinessRuleViolationException(
        'Asset_Code_Invalid',
        'Asset code must be at least 3 characters long.',
        { currentCode: code },
      );
    }

    return new Asset(id, orgId, name, code);
  }

  public rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'ASSET_NAME_REQUIRED',
        'Asset new name is required',
        { newName },
      );
    }
    this._name = newName;
  }
}
