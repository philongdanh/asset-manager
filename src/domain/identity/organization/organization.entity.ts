import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class Organization extends BaseEntity {
  private _name: string;
  private _taxCode: string | null;
  private _status: OrganizationStatus;
  private _phone: string | null;
  private _email: string | null;
  private _website: string | null;
  private _address: string | null;

  protected constructor(builder: OrganizationBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt, builder.deletedAt);
    this._name = builder.name;
    this._taxCode = builder.taxCode;
    this._status = builder.status;
    this._phone = builder.phone;
    this._email = builder.email;
    this._website = builder.website;
    this._address = builder.address;
  }

  // --- Getters ---
  public get name(): string {
    return this._name;
  }

  public get taxCode(): string | null {
    return this._taxCode;
  }

  public get status(): OrganizationStatus {
    return this._status;
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

  public get address(): string | null {
    return this._address;
  }

  // --- Setters ---
  public set taxCode(taxCode: string | null) {
    this._taxCode = taxCode;
    this.markAsUpdated();
  }

  public set status(status: OrganizationStatus) {
    if (this._status !== status) {
      this._status = status;
      this.markAsUpdated();
    }
  }

  // --- Business Methods ---
  public updateInfo(
    name?: string,
    phone?: string | null,
    email?: string | null,
    website?: string | null,
    address?: string | null,
  ): void {
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        throw new BusinessRuleViolationException(
          'ORGANIZATION_NAME_REQUIRED',
          'Organization name cannot be empty.',
        );
      }
      this._name = name;
    }

    if (phone !== undefined) {
      this._phone = phone;
    }

    if (email !== undefined) {
      this._email = email;
    }

    if (website !== undefined) {
      this._website = website;
    }

    if (address !== undefined) {
      this._address = address;
    }

    this.markAsUpdated();
  }

  public markAsDeleted(): void {
    this._status = OrganizationStatus.INACTIVE;
    super.markAsDeleted();
  }

  public restore(): void {
    super.restore();
    this._status = OrganizationStatus.ACTIVE;
  }

  // --- Helper Methods ---
  public isActive(): boolean {
    return this._status === OrganizationStatus.ACTIVE;
  }

  // --- Static Factory ---
  public static builder(id: string, name: string): OrganizationBuilder {
    return new OrganizationBuilder(id, name);
  }

  public static createFromBuilder(builder: OrganizationBuilder): Organization {
    return new Organization(builder);
  }
}

// --- Builder Class ---
export class OrganizationBuilder {
  public status: OrganizationStatus = OrganizationStatus.ACTIVE;
  public taxCode: string | null = null;
  public phone: string | null = null;
  public email: string | null = null;
  public website: string | null = null;
  public address: string | null = null;
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

  public withStatus(status: OrganizationStatus): this {
    this.status = status;
    return this;
  }

  public withTaxCode(taxCode: string | null): this {
    this.taxCode = taxCode;
    return this;
  }

  public withContactInfo(
    phone: string | null,
    email: string | null,
    website: string | null,
    address: string | null,
  ): this {
    this.phone = phone;
    this.email = email;
    this.website = website;
    this.address = address;
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
    if (!this.id) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_ID_REQUIRED',
        'ID is mandatory for organization.',
      );
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_NAME_INVALID',
        'Organization name cannot be empty.',
      );
    }
    if (this.email && this.email.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'INVALID_EMAIL',
        'Invalid email format.',
      );
    }

    return Organization.createFromBuilder(this);
  }
}
