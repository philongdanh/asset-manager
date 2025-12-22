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
    if (!id)
      throw new BusinessRuleViolationException(
        'ORGANIZATION_ID_REQUIRED',
        'ID is mandatory.',
      );
    if (!name || !name.trim()) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_NAME_REQUIRED',
        'Organization name cannot be empty.',
      );
    }
    return new Organization(id, name, status);
  }

  public updateInfo(name: string): void {
    this.ensureIsActive();
    if (name && name.trim()) {
      this._name = name;
    }
  }

  public updateStatus(status: OrganizationStatus): void {
    if (this._status === status) {
      throw new BusinessRuleViolationException(
        'STATUS_ALREADY_SET',
        `Organization is already ${status}.`,
      );
    }
    this._status = status;
  }

  private ensureIsActive(): void {
    if (this._status !== OrganizationStatus.ACTIVE) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_INACTIVE',
        'Organization is inactive.',
      );
    }
  }
}
