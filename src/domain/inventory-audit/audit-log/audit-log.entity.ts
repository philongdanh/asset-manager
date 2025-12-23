import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class AuditLog extends BaseEntity {
  private _organizationId: string;
  private _userId: string;
  private _action: string; // e.g., 'CREATE', 'UPDATE', 'DELETE'
  private _entityName: string; // e.g., 'Asset', 'User'
  private _entityId: string;
  private _oldValue: string | null; // JSON string
  private _newValue: string | null; // JSON string
  private _ipAddress: string | null;
  private _userAgent: string | null;
  private _createdAt: Date;

  protected constructor(builder: AuditLogBuilder) {
    super(builder.id);
    this._organizationId = builder.organizationId;
    this._userId = builder.userId;
    this._action = builder.action;
    this._entityName = builder.entityName;
    this._entityId = builder.entityId;
    this._oldValue = builder.oldValue;
    this._newValue = builder.newValue;
    this._ipAddress = builder.ipAddress;
    this._userAgent = builder.userAgent;
    this._createdAt = builder.createdAt;
  }

  // --- Getters ---
  public get organizationId(): string {
    return this._organizationId;
  }

  public get userId(): string {
    return this._userId;
  }

  public get action(): string {
    return this._action;
  }

  public get entityName(): string {
    return this._entityName;
  }

  public get entityId(): string {
    return this._entityId;
  }

  public get oldValue(): string | null {
    return this._oldValue;
  }

  public get newValue(): string | null {
    return this._newValue;
  }

  public get ipAddress(): string | null {
    return this._ipAddress;
  }

  public get userAgent(): string | null {
    return this._userAgent;
  }

  public get _createdAt(): Date {
    return this._createdAt;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    organizationId: string,
    userId: string,
    action: string,
    entityName: string,
    entityId: string,
  ): AuditLogBuilder {
    return new AuditLogBuilder(
      id,
      organizationId,
      userId,
      action,
      entityName,
      entityId,
    );
  }

  public static createFromBuilder(builder: AuditLogBuilder): AuditLog {
    return new AuditLog(builder);
  }
}

export class AuditLogBuilder {
  public readonly id: string;
  public readonly organizationId: string;
  public readonly userId: string;
  public readonly action: string;
  public readonly entityName: string;
  public readonly entityId: string;
  public oldValue: string | null = null;
  public newValue: string | null = null;
  public ipAddress: string | null = null;
  public userAgent: string | null = null;
  public createdAt: Date = new Date();

  constructor(
    id: string,
    organizationId: string,
    userId: string,
    action: string,
    entityName: string,
    entityId: string,
  ) {
    this.id = id;
    this.organizationId = organizationId;
    this.userId = userId;
    this.action = action;
    this.entityName = entityName;
    this.entityId = entityId;
  }

  public withChanges(oldVal: any, newVal: any): this {
    this.oldValue = oldVal ? JSON.stringify(oldVal) : null;
    this.newValue = newVal ? JSON.stringify(newVal) : null;
    return this;
  }

  public withClientInfo(ip: string | null, ua: string | null): this {
    this.ipAddress = ip;
    this.userAgent = ua;
    return this;
  }

  public build(): AuditLog {
    this.validate();
    return AuditLog.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id || !this.organizationId || !this.userId) {
      throw new BusinessRuleViolationException(
        'AUDIT_LOG_REQUIRED_FIELDS',
        'ID, Organization ID, and User ID are mandatory.',
      );
    }
    if (!this.action || !this.entityName) {
      throw new BusinessRuleViolationException(
        'AUDIT_LOG_ACTION_REQUIRED',
        'Action and Entity Name are mandatory.',
      );
    }
  }
}
