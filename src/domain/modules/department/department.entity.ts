import { BaseEntity } from '../../core/base/base.entity';
import { BusinessRuleViolationException } from '../../core/exceptions';

export class Department extends BaseEntity {
  private _organizationId: string;
  private _name: string;
  private _parentId: string | null;

  constructor(
    id: string,
    organizationId: string,
    name: string,
    parentId: string | null,
  ) {
    super(id);
    this._organizationId = organizationId;
    this._name = name;
    this._parentId = parentId;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get name(): string {
    return this._name;
  }

  get parentId(): string | null {
    return this._parentId;
  }

  public static create(
    id: string,
    organizationId: string,
    name: string,
    parentId: string | null,
  ): Department {
    if (!name || name.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'DEPARTMENT_NAME_REQUIRED',
        'Department name cannot be empty.',
      );
    }

    if (!organizationId) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_ID_REQUIRED',
        'Department must belong to an organization.',
      );
    }

    if (parentId && id === parentId) {
      throw new BusinessRuleViolationException(
        'INVALID_HIERARCHY',
        'A department cannot be its own parent.',
        { id, parentId },
      );
    }

    return new Department(id, organizationId, name, parentId);
  }

  public updateInfo(name?: string, parentId?: string | null): void {
    if (name !== undefined) {
      if (name.trim().length === 0) {
        throw new BusinessRuleViolationException(
          'DEPARTMENT_NAME_REQUIRED',
          'Updated department name cannot be empty.',
        );
      }
      this._name = name;
    }

    if (parentId !== undefined) {
      if (parentId === this._id) {
        throw new BusinessRuleViolationException(
          'INVALID_PARENT',
          'A department cannot be moved to be a child of itself.',
        );
      }
      this._parentId = parentId;
    }
  }
}
