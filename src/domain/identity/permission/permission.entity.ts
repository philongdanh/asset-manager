import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class Permission extends BaseEntity {
  private _name: string;
  private _description: string | null;

  protected constructor(builder: PermissionBuilder) {
    super(builder.id);
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
  }

  // --- Static Builder Access ---
  public static builder(id: string, name: string): PermissionBuilder {
    return new PermissionBuilder(id, name);
  }

  // Static factory method
  public static createFromBuilder(builder: PermissionBuilder): Permission {
    return new Permission(builder);
  }
}

export class PermissionBuilder {
  public readonly id: string;
  public name: string;
  public description: string | null = null;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  public withDescription(description: string | null): this {
    this.description = description;
    return this;
  }

  public build(): Permission {
    this.validate();
    return Permission.createFromBuilder(this);
  }

  private validate(): void {
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
  }
}
