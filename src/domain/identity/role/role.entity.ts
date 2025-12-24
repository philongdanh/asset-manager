import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class Role extends BaseEntity {
  private _organizationId: string;
  private _roleName: string;

  protected constructor(builder: RoleBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt, builder.deletedAt);
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
    this.markAsUpdated();
  }

  public updateOrganization(newOrganizationId: string): void {
    if (!newOrganizationId) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_ID_REQUIRED',
        'Organization ID is required.',
      );
    }
    this._organizationId = newOrganizationId;
    this.markAsUpdated();
  }

  // --- Helper Methods ---
  public isSystemRole(): boolean {
    // System roles are typically predefined and start with SYSTEM_
    return this._roleName.startsWith('SYSTEM_');
  }

  public isDefaultRole(): boolean {
    // Default roles like ADMIN, USER, VIEWER
    const defaultRoles = ['ADMIN', 'USER', 'VIEWER', 'EDITOR', 'MANAGER'];
    return defaultRoles.includes(this._roleName.toUpperCase());
  }

  public hasPermission(permissionName: string): boolean {
    // This would be implemented in the domain service
    // For now, it's a placeholder for the domain logic
    console.log(this.hasPermission.name, permissionName);
    return false;
  }

  // --- Static Factory ---
  public static builder(
    id: string,
    organizationId: string,
    roleName: string,
  ): RoleBuilder {
    return new RoleBuilder(id, organizationId, roleName);
  }

  public static createFromBuilder(builder: RoleBuilder): Role {
    return new Role(builder);
  }
}

// --- Builder Class ---
export class RoleBuilder {
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly roleName: string,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
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

  public build(): Role {
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

    return Role.createFromBuilder(this);
  }
}
