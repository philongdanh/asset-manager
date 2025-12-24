import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class Permission extends BaseEntity {
  private _name: string;
  private _description: string | null;

  protected constructor(builder: PermissionBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt, builder.deletedAt);
    this._name = builder.name;
    this._description = builder.description;
  }

  // --- Getters ---
  public get name(): string {
    return this._name;
  }

  public get description(): string | null {
    return this._description;
  }

  // --- Business Methods ---
  public updateInfo(name?: string, description?: string | null): void {
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        throw new BusinessRuleViolationException(
          'PERMISSION_NAME_REQUIRED',
          'Permission name cannot be empty.',
        );
      }
      this._name = name;
    }

    if (description !== undefined) {
      this._description = description;
    }

    this.markAsUpdated();
  }

  // --- Helper Methods ---
  public isSystemPermission(): boolean {
    return this._name.startsWith('SYSTEM.');
  }

  public isModulePermission(module?: string): boolean {
    if (!module) return false;
    return this._name.startsWith(`${module.toUpperCase()}.`);
  }

  public getModuleFromName(): string | null {
    const parts = this._name.split('.');
    return parts.length > 1 ? parts[0] : null;
  }

  public getActionFromName(): string | null {
    const parts = this._name.split('.');
    return parts.length > 1 ? parts.slice(1).join('.') : null;
  }

  // --- Static Factory ---
  public static builder(id: string, name: string): PermissionBuilder {
    return new PermissionBuilder(id, name);
  }

  public static createFromBuilder(builder: PermissionBuilder): Permission {
    return new Permission(builder);
  }
}

// --- Builder Class ---
export class PermissionBuilder {
  public description: string | null = null;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public withDescription(description: string | null): this {
    this.description = description;
    return this;
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

  public build(): Permission {
    if (!this.id) {
      throw new BusinessRuleViolationException(
        'PERMISSION_ID_REQUIRED',
        'ID is mandatory for permission.',
      );
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'PERMISSION_NAME_INVALID',
        'Permission name cannot be empty.',
      );
    }

    // Validate name format: should be in format MODULE.ACTION or SYSTEM.ACTION
    if (!this.name.includes('.')) {
      throw new BusinessRuleViolationException(
        'INVALID_PERMISSION_FORMAT',
        'Permission name must be in format: MODULE.ACTION or SYSTEM.ACTION',
      );
    }

    return Permission.createFromBuilder(this);
  }
}
