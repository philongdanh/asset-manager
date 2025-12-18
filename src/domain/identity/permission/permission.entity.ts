import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class Permission extends BaseEntity {
  private _name: string;
  private _description: string | null;

  constructor(id: string, name: string, description: string | null = null) {
    super(id);
    this._name = name;
    this._description = description;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  public static create(
    id: string,
    name: string,
    description: string | null = null,
  ): Permission {
    if (!id)
      throw new BusinessRuleViolationException(
        'PERMISSION_ID_REQUIRED',
        'ID is mandatory.',
      );
    if (!name || !name.trim()) {
      throw new BusinessRuleViolationException(
        'PERMISSION_NAME_INVALID',
        'Permission name cannot be empty',
      );
    }
    return new Permission(id, name, description);
  }

  public updateInfo(name?: string, description?: string | null): void {
    if (name !== undefined) {
      if (!name.trim()) {
        throw new BusinessRuleViolationException(
          'NAME_REQUIRED',
          'Name cannot be empty.',
        );
      }
      this._name = name;
    }
    if (description !== undefined) {
      this._description = description;
    }
  }
}
