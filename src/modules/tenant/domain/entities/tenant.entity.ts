import { BaseEntity, BusinessRuleViolationException } from 'src/shared/domain';

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class Tenant extends BaseEntity {
  private _name: string;
  private _status: TenantStatus;

  private _phone: string | null;
  private _email: string | null;
  private _code: string | null;
  private _website: string | null;
  private _address: string | null;
  private _logo: string | null;

  protected constructor(builder: TenantBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt, builder.deletedAt);
    this._name = builder.name;
    this._status = builder.status;
    this._code = builder.code;
    this._phone = builder.phone;
    this._email = builder.email;
    this._website = builder.website;
    this._address = builder.address;
    this._logo = builder.logo;
  }

  // --- Getters ---
  public get name(): string {
    return this._name;
  }

  public get status(): TenantStatus {
    return this._status;
  }

  public get code(): string | null {
    return this._code;
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

  public get logo(): string | null {
    return this._logo;
  }

  // --- Business Methods ---
  public withStatus(status: TenantStatus) {
    if (this._status !== status) {
      this._status = status;
      this.markAsUpdated();
    }
  }

  public updateInfo(
    name?: string,
    code?: string | null,
    phone?: string | null,
    email?: string | null,
    website?: string | null,
    address?: string | null,
    logo?: string | null,
  ): void {
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        throw new BusinessRuleViolationException(
          'tenant_NAME_REQUIRED',
          'Tenant name cannot be empty.',
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

    if (code !== undefined) {
      this._code = code;
    }

    if (website !== undefined) {
      this._website = website;
    }

    if (address !== undefined) {
      this._address = address;
    }

    if (logo !== undefined) {
      this._logo = logo;
    }

    this.markAsUpdated();
  }

  public markAsDeleted(): void {
    this._status = TenantStatus.INACTIVE;
    super.markAsDeleted();
  }

  public restore(): void {
    super.restore();
    this._status = TenantStatus.ACTIVE;
  }

  // --- Helper Methods ---
  public isActive(): boolean {
    return this._status === TenantStatus.ACTIVE;
  }

  // --- Static Factory ---
  public static builder(id: string, name: string): TenantBuilder {
    return new TenantBuilder(id, name);
  }

  public static createFromBuilder(builder: TenantBuilder): Tenant {
    return new Tenant(builder);
  }
}

// --- Builder Class ---
export class TenantBuilder {
  public status: TenantStatus = TenantStatus.ACTIVE;

  public phone: string | null = null;
  public email: string | null = null;
  public code: string | null = null;
  public website: string | null = null;
  public address: string | null = null;
  public logo: string | null = null;

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

  public withStatus(status: TenantStatus): this {
    this.status = status;
    return this;
  }

  public withCode(code: string | null): this {
    this.code = code;
    return this;
  }

  public withContactInfo(
    phone: string | null,
    email: string | null,
    website: string | null,
    address: string | null,
    logoUrl: string | null,
  ): this {
    this.phone = phone;
    this.email = email;
    this.website = website;
    this.address = address;
    this.logo = logoUrl;
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

  public build(): Tenant {
    if (!this.id) {
      throw new BusinessRuleViolationException(
        'TENANT_ID_REQUIRED',
        'ID is mandatory for tenant.',
      );
    }
    if (!this.name || !this.name.trim().length) {
      throw new BusinessRuleViolationException(
        'TENANT_NAME_INVALID',
        'Tenant name cannot be empty.',
      );
    }
    if (this.email && !this.email.trim().length) {
      throw new BusinessRuleViolationException(
        'INVALID_EMAIL',
        'Invalid email format.',
      );
    }

    return Tenant.createFromBuilder(this);
  }
}
