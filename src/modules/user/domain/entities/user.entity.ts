import { BaseEntity, BusinessRuleViolationException } from 'src/shared/domain';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class User extends BaseEntity {
  private _organizationId: string | null;
  private _departmentId: string | null;
  private _username: string;
  private _email: string;
  private _password: string;
  private _hashedRefreshToken: string | null;
  private _fullName: string | null;
  private _dateOfBirth: Date | null;
  private _gender: string | null;
  private _phoneNumber: string | null;
  private _status: UserStatus;
  private _avatarUrl: string | null;
  private _isRoot: boolean;

  protected constructor(builder: UserBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt, builder.deletedAt);
    this._organizationId = builder.organizationId;
    this._departmentId = builder.departmentId;
    this._username = builder.username;
    this._email = builder.email;
    this._password = builder.password;
    this._hashedRefreshToken = builder.hashedRefreshToken;
    this._fullName = builder.fullName;
    this._dateOfBirth = builder.dateOfBirth;
    this._gender = builder.gender;
    this._phoneNumber = builder.phoneNumber;
    this._status = builder.status;
    this._avatarUrl = builder.avatarUrl;
    this._isRoot = builder.isRoot;
  }

  // --- Getters ---
  public get organizationId(): string | null {
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

  public get password(): string {
    return this._password;
  }

  public get hashedRefreshToken(): string | null {
    return this._hashedRefreshToken;
  }

  public setHashedRefreshToken(hash: string | null): void {
    this._hashedRefreshToken = hash;
  }

  public get fullName(): string | null {
    return this._fullName;
  }

  public get dateOfBirth(): Date | null {
    return this._dateOfBirth;
  }

  public get gender(): string | null {
    return this._gender;
  }

  public get phoneNumber(): string | null {
    return this._phoneNumber;
  }

  public get status(): UserStatus {
    return this._status;
  }

  public get avatarUrl(): string | null {
    return this._avatarUrl;
  }

  public get isRoot(): boolean {
    return this._isRoot;
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

  public updateProfile(
    fullName: string | null,
    dateOfBirth: Date | null,
    gender: string | null,
    phoneNumber: string | null,
  ): void {
    this._fullName = fullName;
    this._dateOfBirth = dateOfBirth;
    this._gender = gender;
    this._phoneNumber = phoneNumber;
    this.markAsUpdated();
  }

  public changePassword(newPassword: string): void {
    if (!newPassword || newPassword.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'PASSWORD_REQUIRED',
        'Password cannot be empty.',
      );
    }

    if (newPassword.length < 8) {
      throw new BusinessRuleViolationException(
        'PASSWORD_TOO_SHORT',
        'Password must be at least 8 characters long.',
      );
    }

    this._password = newPassword;
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

  public updateAvatar(url: string | null): void {
    this._avatarUrl = url;
    this.markAsUpdated();
  }

  public markAsDeleted(): void {
    super.markAsDeleted();
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

  public isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  public hasDepartment(): boolean {
    return !!this._departmentId;
  }

  public verifyPassword(password: string): boolean {
    return this._password === password;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // --- Static Factory ---
  public static builder(
    id: string,
    organizationId: string | null,
    username: string,
    email: string,
    password: string,
  ): UserBuilder {
    return new UserBuilder(id, organizationId, username, email, password);
  }

  public static createFromBuilder(builder: UserBuilder): User {
    return new User(builder);
  }
}

// --- Builder Class ---
export class UserBuilder {
  public departmentId: string | null = null;
  public status: UserStatus = UserStatus.ACTIVE;
  public avatarUrl: string | null = null;
  public isRoot: boolean = false;
  public hashedRefreshToken: string | null = null;
  public fullName: string | null = null;
  public dateOfBirth: Date | null = null;
  public gender: string | null = null;
  public phoneNumber: string | null = null;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  constructor(
    public readonly id: string,
    public readonly organizationId: string | null,
    public readonly username: string,
    public readonly email: string,
    public password: string,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public withRefreshToken(hash: string | null): this {
    this.hashedRefreshToken = hash;
    return this;
  }

  public inDepartment(departmentId: string | null): this {
    this.departmentId = departmentId;
    return this;
  }

  public withStatus(status: UserStatus): this {
    this.status = status;
    return this;
  }

  public withPassword(password: string): this {
    this.password = password;
    return this;
  }

  public withAvatarUrl(url: string | null): this {
    this.avatarUrl = url;
    return this;
  }

  public withProfile(
    fullName: string | null,
    dateOfBirth: Date | null,
    gender: string | null,
    phoneNumber: string | null,
  ): this {
    this.fullName = fullName;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
    this.phoneNumber = phoneNumber;
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

  public asRoot(isRoot: boolean = true): this {
    this.isRoot = isRoot;
    return this;
  }

  public build(): User {
    if (!this.id) {
      throw new BusinessRuleViolationException(
        'USER_ID_REQUIRED',
        'User ID is mandatory.',
      );
    }
    /* if (!this.organizationId) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_ID_REQUIRED',
        'Organization ID is mandatory for user.',
      );
    } */
    if (!this.username || this.username.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'USERNAME_REQUIRED',
        'Username cannot be empty.',
      );
    }
    if (!this.email || this.email.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'INVALID_EMAIL',
        'A valid email is required.',
      );
    }
    if (!this.password || this.password.trim().length === 0) {
      throw new BusinessRuleViolationException(
        'PASSWORD_REQUIRED',
        'Password is mandatory.',
      );
    }

    return User.createFromBuilder(this);
  }
}
