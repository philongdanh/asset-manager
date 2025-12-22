import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class User extends BaseEntity {
  private _organizationId: string;
  private _departmentId: string | null;
  private _username: string;
  private _email: string;

  protected constructor(builder: UserBuilder) {
    super(builder.id);
    this._organizationId = builder.organizationId;
    this._departmentId = builder.departmentId;
    this._username = builder.username;
    this._email = builder.email;
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

  // --- Business Methods ---
  public changeDepartment(departmentId: string | null): void {
    this._departmentId = departmentId;
  }

  public updateEmail(newEmail: string): void {
    if (!newEmail || !newEmail.includes('@')) {
      throw new BusinessRuleViolationException(
        'INVALID_EMAIL_FORMAT',
        'The provided email address is invalid.',
      );
    }
    this._email = newEmail;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    organizationId: string,
    username: string,
    email: string,
  ): UserBuilder {
    return new UserBuilder(id, organizationId, username, email);
  }

  // Static factory method
  public static createFromBuilder(builder: UserBuilder): User {
    return new User(builder);
  }
}

export class UserBuilder {
  public readonly id: string;
  public readonly organizationId: string;
  public readonly username: string;
  public email: string;
  public departmentId: string | null = null;

  constructor(
    id: string,
    organizationId: string,
    username: string,
    email: string,
  ) {
    this.id = id;
    this.organizationId = organizationId;
    this.username = username;
    this.email = email;
  }

  public inDepartment(departmentId: string | null): this {
    this.departmentId = departmentId;
    return this;
  }

  public build(): User {
    this.validate();
    return User.createFromBuilder(this);
  }

  private validate(): void {
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
    if (!this.email || !this.email.includes('@')) {
      throw new BusinessRuleViolationException(
        'INVALID_EMAIL',
        'A valid email is required.',
      );
    }
  }
}
