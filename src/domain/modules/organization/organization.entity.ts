import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class Organization extends BaseEntity {
  private _name: string;
  private _status: OrganizationStatus;

  constructor(
    id: string,
    name: string,
    status: OrganizationStatus = OrganizationStatus.ACTIVE,
  ) {
    super(id);
    this._name = name;
    this._status = status;
  }

  get name(): string {
    return this._name;
  }

  get status(): OrganizationStatus {
    return this._status;
  }

  public static create(
    id: string,
    name: string,
    status: OrganizationStatus = OrganizationStatus.ACTIVE,
  ): Organization {
    if (!name || name.trim().length < 2) {
      throw new BusinessRuleViolationException(
        'ORG_NAME_TOO_SHORT',
        'Organization name must be at least 2 characters long.',
      );
    }

    if (!id) {
      throw new BusinessRuleViolationException(
        'ORG_ID_REQUIRED',
        'Organization ID is mandatory.',
      );
    }

    return new Organization(id, name, status);
  }

  public updateInfo(newName: string): void {
    this.ensureIsActive();

    if (!newName || newName.trim().length < 2) {
      throw new BusinessRuleViolationException(
        'ORG_NAME_INVALID',
        'New organization name is invalid.',
      );
    }

    this._name = newName;
  }

  public activate(): void {
    if (this._status === OrganizationStatus.ACTIVE) {
      throw new BusinessRuleViolationException(
        'ORG_ALREADY_ACTIVE',
        'Organization is already active.',
      );
    }
    this._status = OrganizationStatus.ACTIVE;
  }

  public deactivate(): void {
    if (this._status === OrganizationStatus.INACTIVE) {
      throw new BusinessRuleViolationException(
        'ORG_ALREADY_INACTIVE',
        'Organization is already inactive.',
      );
    }
  }

  private ensureIsActive(): void {
    if (this._status !== OrganizationStatus.ACTIVE) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_INACTIVE',
        'Action cannot be performed because the organization is inactive.',
        { currentStatus: this._status },
      );
    }
  }
}
