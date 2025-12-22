import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class Organization extends BaseEntity {
  private _orgName: string;
  private _status: string;

  protected constructor(builder: OrganizationBuilder) {
    super(builder.id);
    this._orgName = builder.orgName;
    this._status = builder.status;
  }

  // --- Getters ---
  public get orgName(): string {
    return this._orgName;
  }

  public get status(): string {
    return this._status;
  }

  // --- Business Methods ---
  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_NAME_REQUIRED',
        'Organization name cannot be empty.',
      );
    }
    this._orgName = newName;
  }

  public activate(): void {
    this._status = 'ACTIVE';
  }

  public deactivate(): void {
    this._status = 'INACTIVE';
  }

  // --- Static Builder Access ---
  public static builder(id: string, orgName: string): OrganizationBuilder {
    return new OrganizationBuilder(id, orgName);
  }

  // Static factory method
  public static createFromBuilder(builder: OrganizationBuilder): Organization {
    return new Organization(builder);
  }
}

export class OrganizationBuilder {
  public readonly id: string;
  public orgName: string;
  public status: string = 'ACTIVE';

  constructor(id: string, orgName: string) {
    this.id = id;
    this.orgName = orgName;
  }

  public withStatus(status: string): this {
    const validStatuses = ['ACTIVE', 'INACTIVE', 'PENDING'];
    if (!validStatuses.includes(status)) {
      throw new BusinessRuleViolationException(
        'INVALID_ORGANIZATION_STATUS',
        `Status must be one of: ${validStatuses.join(', ')}`,
      );
    }
    this.status = status;
    return this;
  }

  public build(): Organization {
    this.validate();
    return Organization.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_ID_REQUIRED',
        'ID is mandatory for organization.',
      );
    }
    if (!this.orgName || this.orgName.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_NAME_INVALID',
        'Organization name cannot be empty.',
      );
    }
  }
}
