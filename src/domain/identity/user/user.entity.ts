import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class User extends BaseEntity {
  private _organizationId: string;
  private _departmentId: string | null;
  private _username: string;
  private _email: string;

  constructor(
    id: string,
    organizationId: string,
    username: string,
    email: string,
    departmentId: string | null = null,
  ) {
    super(id);
    this._organizationId = organizationId;
    this._username = username;
    this._email = email;
    this._departmentId = departmentId;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get departmentId(): string | null {
    return this._departmentId;
  }

  get username(): string {
    return this._username;
  }

  get email(): string {
    return this._email;
  }

  public static create(
    id: string,
    organizationId: string,
    username: string,
    email: string,
    departmentId: string | null = null,
  ): User {
    if (!id)
      throw new BusinessRuleViolationException(
        'USER_ID_REQUIRED',
        'User ID is mandatory.',
      );
    if (!organizationId)
      throw new BusinessRuleViolationException(
        'ORG_ID_REQUIRED',
        'Organization ID is mandatory.',
      );

    if (!username || !username.trim()) {
      throw new BusinessRuleViolationException(
        'USERNAME_REQUIRED',
        'Username cannot be empty.',
      );
    }

    if (!email || !email.includes('@')) {
      throw new BusinessRuleViolationException(
        'INVALID_EMAIL',
        'Email is invalid.',
      );
    }

    return new User(id, organizationId, username, email, departmentId);
  }

  public updateInfo(username?: string, departmentId?: string | null): void {
    if (username !== undefined) {
      if (!username.trim()) {
        throw new BusinessRuleViolationException(
          'USERNAME_REQUIRED',
          'Username cannot be empty.',
        );
      }
      this._username = username;
    }

    if (departmentId !== undefined) {
      this._departmentId = departmentId;
    }
  }

  public changeDepartment(newDepartmentId: string | null): void {
    this._departmentId = newDepartmentId;
  }
}
