import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class Role extends BaseEntity {
  private _organizationId: string;
  private _roleName: string;

  protected constructor(builder: RoleBuilder) {
    super(builder.id);
    this._organizationId = builder.organizationId;
    this._roleName = builder.roleName;
  }

  // --- Getters ---
  public get organizationId(): string {
    return this._organizationId;
  }
  public get roleName(): string {
    return this._roleName;
  }

  // --- Business Methods ---
  public rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'ROLE_NAME_REQUIRED',
        'Role name cannot be empty.',
      );
    }
    this._roleName = newName;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    organizationId: string,
    roleName: string,
  ): RoleBuilder {
    return new RoleBuilder(id, organizationId, roleName);
  }

  // Static factory method
  public static createFromBuilder(builder: RoleBuilder): Role {
    return new Role(builder);
  }
}

export class RoleBuilder {
  public readonly id: string;
  public readonly organizationId: string;
  public roleName: string;

  constructor(id: string, organizationId: string, roleName: string) {
    this.id = id;
    this.organizationId = organizationId;
    this.roleName = roleName;
  }

  public build(): Role {
    this.validate();
    return Role.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id) {
      throw new BusinessRuleViolationException(
        'ROLE_ID_REQUIRED',
        'ID is mandatory for role.',
      );
    }
    if (!this.organizationId) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_ID_REQUIRED',
        'Organization ID is mandatory for role.',
      );
    }
    if (!this.roleName || this.roleName.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'ROLE_NAME_INVALID',
        'Role name cannot be empty.',
      );
    }
  }
}
