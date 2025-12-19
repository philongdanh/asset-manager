import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class Role extends BaseEntity {
  private _organizationId: string;
  private _name: string;
  private _permissionIds: string[];

  constructor(
    id: string,
    organizationId: string,
    name: string,
    permissionIds: string[] = [],
  ) {
    super(id);
    this._organizationId = organizationId;
    this._name = name;
    this._permissionIds = permissionIds;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get name(): string {
    return this._name;
  }

  get permissionIds(): string[] {
    return [...this._permissionIds];
  }

  public static create(
    id: string,
    organizationId: string,
    name: string,
    permissionIds: string[] = [],
  ): Role {
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

    const uniquePermissionIds = [...new Set(permissionIds)];

    return new Role(id, organizationId, name, uniquePermissionIds);
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

  public assignPermission(permissionId: string) {
    if (!permissionId) {
      throw new BusinessRuleViolationException(
        'PERMISSION_ID_REQUIRED',
        'Permission ID cannot be empty.',
      );
    }

    if (this._permissionIds.includes(permissionId)) {
      return;
    }

    this._permissionIds.push(permissionId);
  }

  public revokePermission(permissionId: string) {
    if (!this._permissionIds.includes(permissionId)) {
      throw new BusinessRuleViolationException(
        'PERMISSION_NOT_FOUND_IN_ROLE',
        'This role does not have the specified permission.',
      );
    }

    this._permissionIds = this._permissionIds.filter(
      (id) => id !== permissionId,
    );
  }
}
