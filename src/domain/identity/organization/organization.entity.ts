import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export class Organization extends BaseEntity {
  private _orgName: string;
  private _status: OrganizationStatus;
  private _taxCode: string | null;
  private _address: string | null;
  private _phone: string | null;
  private _email: string | null;
  private _website: string | null;

  protected constructor(builder: OrganizationBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt, builder.deletedAt);
    this._orgName = builder.orgName;
    this._status = builder.status;
    this._taxCode = builder.taxCode;
    this._address = builder.address;
    this._phone = builder.phone;
    this._email = builder.email;
    this._website = builder.website;
  }

  // --- Getters ---
  public get orgName(): string {
    return this._orgName;
  }

  public get status(): OrganizationStatus {
    return this._status;
  }

  public get taxCode(): string | null {
    return this._taxCode;
  }

  public get address(): string | null {
    return this._address;
  }

  public get phone(): string | null {
    return this._phone;
  }

  public get email(): string | null {
    return this._email;
  }

  public get website(): string | null {
    return this._website;
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
    this.markAsUpdated();
  }

  public updateContactInfo(
    phone?: string | null,
    email?: string | null,
    website?: string | null,
  ): void {
    if (email && !this.isValidEmail(email)) {
      throw new BusinessRuleViolationException(
        'INVALID_EMAIL',
        'Invalid email format.',
      );
    }

    this._phone = phone || null;
    this._email = email || null;
    this._website = website || null;
    this.markAsUpdated();
  }

  public updateAddress(address: string | null): void {
    this._address = address;
    this.markAsUpdated();
  }

  public updateTaxCode(taxCode: string | null): void {
    this._taxCode = taxCode;
    this.markAsUpdated();
  }

  public activate(): void {
    this._status = OrganizationStatus.ACTIVE;
    this.markAsUpdated();
  }

  public deactivate(): void {
    this._status = OrganizationStatus.INACTIVE;
    this.markAsUpdated();
  }

  public suspend(): void {
    this._status = OrganizationStatus.SUSPENDED;
    this.markAsUpdated();
  }

  public markAsDeleted(): void {
    super.markAsDeleted();
    this._status = OrganizationStatus.DELETED;
  }

  public restore(): void {
    super.restore();
    this._status = OrganizationStatus.ACTIVE;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
  public status: OrganizationStatus = OrganizationStatus.ACTIVE;
  public taxCode: string | null = null;
  public address: string | null = null;
  public phone: string | null = null;
  public email: string | null = null;
  public website: string | null = null;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  constructor(id: string, orgName: string) {
    this.id = id;
    this.orgName = orgName;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public withStatus(status: OrganizationStatus): this {
    this.status = status;
    return this;
  }

  public withTaxCode(taxCode: string | null): this {
    this.taxCode = taxCode;
    return this;
  }

  public withAddress(address: string | null): this {
    this.address = address;
    return this;
  }

  public withContactInfo(
    phone: string | null,
    email: string | null,
    website: string | null,
  ): this {
    this.phone = phone;
    this.email = email;
    this.website = website;
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
    if (this.email && !this.isValidEmail(this.email)) {
      throw new BusinessRuleViolationException(
        'INVALID_EMAIL',
        'Invalid email format.',
      );
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
