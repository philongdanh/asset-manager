import { BaseEntity, BusinessRuleViolationException } from 'src/shared/domain';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  ASSIGN = 'ASSIGN',
  TRANSFER = 'TRANSFER',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  RESTORE = 'RESTORE',
  DOWNLOAD = 'DOWNLOAD',
  UPLOAD = 'UPLOAD',
}

export enum EntityType {
  ASSET = 'ASSET',
  USER = 'USER',
  DEPARTMENT = 'DEPARTMENT',
  ORGANIZATION = 'ORGANIZATION',
  ROLE = 'ROLE',
  PERMISSION = 'PERMISSION',
  ASSET_CATEGORY = 'ASSET_CATEGORY',
  MAINTENANCE = 'MAINTENANCE',
  TRANSFER = 'TRANSFER',
  DISPOSAL = 'DISPOSAL',
  DOCUMENT = 'DOCUMENT',
  INVENTORY = 'INVENTORY',
  BUDGET = 'BUDGET',
  ACCOUNTING_ENTRY = 'ACCOUNTING_ENTRY',
}

export class AuditLog extends BaseEntity {
  private _organizationId: string;
  private _userId: string;
  private _action: AuditAction;
  private _entityType: EntityType;
  private _entityId: string;
  private _oldValue: string | null;
  private _newValue: string | null;
  private _actionTime: Date;
  private _ipAddress: string | null;

  protected constructor(builder: AuditLogBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt, builder.deletedAt);
    this._organizationId = builder.organizationId;
    this._userId = builder.userId;
    this._action = builder.action;
    this._entityType = builder.entityType;
    this._entityId = builder.entityId;
    this._oldValue = builder.oldValue;
    this._newValue = builder.newValue;
    this._actionTime = builder.actionTime;
    this._ipAddress = builder.ipAddress;
  }

  // --- Getters ---
  public get organizationId(): string {
    return this._organizationId;
  }

  public get userId(): string {
    return this._userId;
  }

  public get action(): AuditAction {
    return this._action;
  }

  public get entityType(): EntityType {
    return this._entityType;
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

  public get actionTime(): Date {
    return this._actionTime;
  }

  public get ipAddress(): string | null {
    return this._ipAddress;
  }

  // --- Business Methods ---
  public updateIpAddress(ipAddress: string | null): void {
    this._ipAddress = ipAddress;
    this.markAsUpdated();
  }

  // --- Helper Methods ---
  public isCreateAction(): boolean {
    return this._action === AuditAction.CREATE;
  }

  public isUpdateAction(): boolean {
    return this._action === AuditAction.UPDATE;
  }

  public isDeleteAction(): boolean {
    return this._action === AuditAction.DELETE;
  }

  public isAssetRelated(): boolean {
    return [
      EntityType.ASSET,
      EntityType.ASSET_CATEGORY,
      EntityType.MAINTENANCE,
      EntityType.TRANSFER,
      EntityType.DISPOSAL,
      EntityType.DOCUMENT,
    ].includes(this._entityType);
  }

  public isUserRelated(): boolean {
    return [EntityType.USER, EntityType.ROLE, EntityType.PERMISSION].includes(
      this._entityType,
    );
  }

  public isFinancialRelated(): boolean {
    return [EntityType.BUDGET, EntityType.ACCOUNTING_ENTRY].includes(
      this._entityType,
    );
  }

  public getParsedOldValue<T>(): T | null {
    try {
      return this._oldValue ? (JSON.parse(this._oldValue) as T) : null;
    } catch {
      return null;
    }
  }

  public getParsedNewValue<T>(): T | null {
    try {
      return this._newValue ? (JSON.parse(this._newValue) as T) : null;
    } catch {
      return null;
    }
  }

  public getChangedFields(): string[] {
    try {
      const oldVal = this.getParsedOldValue<Record<string, unknown>>();
      const newVal = this.getParsedNewValue<Record<string, unknown>>();

      if (!oldVal || !newVal) return [];

      const fields: string[] = [];
      const allKeys = new Set([
        ...Object.keys(oldVal || {}),
        ...Object.keys(newVal || {}),
      ]);

      for (const key of allKeys) {
        const oldValue = oldVal[key];
        const newValue = newVal[key];

        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          fields.push(key);
        }
      }

      return fields;
    } catch {
      return [];
    }
  }

  // --- Static Factory ---
  public static builder(
    id: string,
    organizationId: string,
    userId: string,
    action: AuditAction,
    entityType: EntityType,
    entityId: string,
  ): AuditLogBuilder {
    return new AuditLogBuilder(
      id,
      organizationId,
      userId,
      action,
      entityType,
      entityId,
    );
  }

  public static createFromBuilder(builder: AuditLogBuilder): AuditLog {
    return new AuditLog(builder);
  }
}

// --- Builder Class ---
export class AuditLogBuilder {
  public oldValue: string | null = null;
  public newValue: string | null = null;
  public actionTime: Date = new Date();
  public ipAddress: string | null = null;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly userId: string,
    public readonly action: AuditAction,
    public readonly entityType: EntityType,
    public readonly entityId: string,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public withChanges(
    oldVal: Record<string, unknown> | null,
    newVal: Record<string, unknown> | null,
  ): this {
    this.oldValue = oldVal ? JSON.stringify(oldVal) : null;
    this.newValue = newVal ? JSON.stringify(newVal) : null;
    return this;
  }

  public withIpAddress(ipAddress: string | null): this {
    this.ipAddress = ipAddress;
    return this;
  }

  public withActionTime(actionTime: Date): this {
    this.actionTime = actionTime;
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

  public build(): AuditLog {
    if (!this.id) {
      throw new BusinessRuleViolationException(
        'AUDIT_LOG_ID_REQUIRED',
        'ID is mandatory for audit log.',
      );
    }
    if (!this.organizationId) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_ID_REQUIRED',
        'Organization ID is mandatory for audit log.',
      );
    }
    if (!this.userId) {
      throw new BusinessRuleViolationException(
        'USER_ID_REQUIRED',
        'User ID is mandatory for audit log.',
      );
    }
    if (!this.action) {
      throw new BusinessRuleViolationException(
        'ACTION_REQUIRED',
        'Action is mandatory for audit log.',
      );
    }
    if (!this.entityType) {
      throw new BusinessRuleViolationException(
        'ENTITY_TYPE_REQUIRED',
        'Entity type is mandatory for audit log.',
      );
    }
    if (!this.entityId) {
      throw new BusinessRuleViolationException(
        'ENTITY_ID_REQUIRED',
        'Entity ID is mandatory for audit log.',
      );
    }

    return AuditLog.createFromBuilder(this);
  }
}
