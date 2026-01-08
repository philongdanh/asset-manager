import { BaseEntity, BusinessRuleViolationException } from 'src/shared/domain';

export class Role extends BaseEntity {
  private _tenantId: string;
  private _name: string;

  protected constructor(builder: RoleBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt);
    this._tenantId = builder.tenantId;
    this._name = builder.name;
  }

  // --- Getters --
  public get tenantId(): string {
    return this._tenantId;
  }

  public get name(): string {
    return this._name;
  }

  // --- Setters --
  public set tenantId(tenantId: string) {
    if (!tenantId) {
      throw new BusinessRuleViolationException(
        'TENANT_ID_REQUIRED',
        'Tenant ID is required.',
      );
    }
    this._tenantId = tenantId;
    this.markAsUpdated();
  }

  public set name(name: string) {
    if (!name || name.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'ROLE_NAME_REQUIRED',
        'Role name cannot be empty.',
      );
    }

    this._name = name;
    this.markAsUpdated();
  }

  // --- Static Factory ---
  public static builder(
    id: string,
    tenantId: string,
    name: string,
  ): RoleBuilder {
    return new RoleBuilder(id, tenantId, name);
  }

  public static createFromBuilder(builder: RoleBuilder): Role {
    return new Role(builder);
  }
}

// --- Builder Class ---
export class RoleBuilder {
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public withTimestamps(createdAt: Date, updatedAt: Date): this {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    return this;
  }

  public build(): Role {
    if (!this.id) {
      throw new BusinessRuleViolationException(
        'ROLE_ID_REQUIRED',
        'ID is mandatory for role.',
      );
    }
    if (!this.tenantId) {
      throw new BusinessRuleViolationException(
        'TENANT_ID_REQUIRED',
        'Tenant ID is mandatory for role.',
      );
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'ROLE_NAME_INVALID',
        'Role name cannot be empty.',
      );
    }

    return Role.createFromBuilder(this);
  }
}
