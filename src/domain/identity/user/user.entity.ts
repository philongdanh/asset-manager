import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
  DELETED = 'DELETED',
}

export class User extends BaseEntity {
  private _organizationId: string;
  private _departmentId: string | null;
  private _username: string;
  private _email: string;
  private _status: UserStatus;

  protected constructor(builder: UserBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt, builder.deletedAt);
    this._organizationId = builder.organizationId;
    this._departmentId = builder.departmentId;
    this._username = builder.username;
    this._email = builder.email;
    this._status = builder.status;
  }

  // --- Getters ---
  public get organizationId(): string {
    return this._organizationId;
  }

  public get departmentId(): string | null {
    return this._departmentId;
  }

  public get username(): string {
    return this._username;
  }

  public get email(): string {
    return this._email;
  }

  public get status(): UserStatus {
    return this._status;
  }

  // --- Business Methods ---
  public changeDepartment(departmentId: string | null): void {
    this._departmentId = departmentId;
    this.markAsUpdated();
  }

  public updateEmail(newEmail: string): void {
    if (!newEmail || !this.isValidEmail(newEmail)) {
      throw new BusinessRuleViolationException(
        'INVALID_EMAIL_FORMAT',
        'The provided email address is invalid.',
      );
    }
    this._email = newEmail;
    this.markAsUpdated();
  }

  public updateUsername(newUsername: string): void {
    if (!newUsername || newUsername.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'USERNAME_REQUIRED',
        'Username cannot be empty.',
      );
    }
    this._username = newUsername;
    this.markAsUpdated();
  }

  public activate(): void {
    this._status = UserStatus.ACTIVE;
    this.markAsUpdated();
  }

  public deactivate(): void {
    this._status = UserStatus.INACTIVE;
    this.markAsUpdated();
  }

  public suspend(): void {
    this._status = UserStatus.SUSPENDED;
    this.markAsUpdated();
  }

  public markAsDeleted(): void {
    super.markAsDeleted();
    this._status = UserStatus.DELETED;
  }

  public restore(): void {
    super.restore();
    this._status = UserStatus.ACTIVE;
  }

  // --- Helper Methods ---
  public isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  public isInactive(): boolean {
    return this._status === UserStatus.INACTIVE;
  }

  public isSuspended(): boolean {
    return this._status === UserStatus.SUSPENDED;
  }

  public isDeleted(): boolean {
    return this._status === UserStatus.DELETED;
  }

  public isPending(): boolean {
    return this._status === UserStatus.PENDING;
  }

  public hasDepartment(): boolean {
    return !!this._departmentId;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // --- Static Factory ---
  public static builder(
    id: string,
    organizationId: string,
    username: string,
    email: string,
  ): UserBuilder {
    return new UserBuilder(id, organizationId, username, email);
  }

  public static createFromBuilder(builder: UserBuilder): User {
    return new User(builder);
  }
}

// --- Builder Class ---
export class UserBuilder {
  public departmentId: string | null = null;
  public status: UserStatus = UserStatus.ACTIVE;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly username: string,
    public readonly email: string,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public inDepartment(departmentId: string | null): this {
    this.departmentId = departmentId;
    return this;
  }

  public withStatus(status: UserStatus): this {
    this.status = status;
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

  public build(): User {
    if (!this.id) {
      throw new BusinessRuleViolationException(
        'USER_ID_REQUIRED',
        'User ID is mandatory.',
      );
    }
    if (!this.organizationId) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_ID_REQUIRED',
        'Organization ID is mandatory for user.',
      );
    }
    if (!this.username || this.username.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'USERNAME_REQUIRED',
        'Username cannot be empty.',
      );
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new BusinessRuleViolationException(
        'INVALID_EMAIL',
        'A valid email is required.',
      );
    }

    return User.createFromBuilder(this);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
