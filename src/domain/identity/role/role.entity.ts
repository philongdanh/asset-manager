import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class Role extends BaseEntity {
  private _organizationId: string;
  private _name: string;

  constructor(id: string, organizationId: string, name: string) {
    super(id);
    this._organizationId = organizationId;
    this._name = name;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get name(): string {
    return this._name;
  }

  public static create(id: string, organizationId: string, name: string): Role {
    if (!id)
      throw new BusinessRuleViolationException(
        'ROLE_ID_REQUIRED',
        'Role ID is mandatory.',
      );
    if (!organizationId)
      throw new BusinessRuleViolationException(
        'ORG_ID_REQUIRED',
        'Organization ID is mandatory.',
      );
    if (!name || !name.trim()) {
      throw new BusinessRuleViolationException(
        'ROLE_NAME_REQUIRED',
        'Role name cannot be empty.',
      );
    }
    return new Role(id, organizationId, name);
  }

  public updateInfo(name: string): void {
    if (!name || !name.trim()) {
      throw new BusinessRuleViolationException(
        'ROLE_NAME_REQUIRED',
        'New role name cannot be empty.',
      );
    }
    this._name = name;
  }
}
