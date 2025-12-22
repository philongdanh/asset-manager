import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class MaintenanceSchedule extends BaseEntity {
  private _assetId: string;
  private _organizationId: string;
  private _scheduledDate: Date;
  private _maintenanceType: string;
  private _description: string | null;
  private _status: string;
  private _performedBy: string | null;
  private _completionDate: Date | null;
  private _cost: number;

  protected constructor(builder: MaintenanceScheduleBuilder) {
    super(builder.id);
    this._assetId = builder.assetId;
    this._organizationId = builder.organizationId;
    this._scheduledDate = builder.scheduledDate;
    this._maintenanceType = builder.maintenanceType;
    this._description = builder.description;
    this._status = builder.status;
    this._performedBy = builder.performedBy;
    this._completionDate = builder.completionDate;
    this._cost = builder.cost;
  }

  // --- Getters ---
  public get assetId(): string {
    return this._assetId;
  }

  public get organizationId(): string {
    return this._organizationId;
  }

  public get scheduledDate(): Date {
    return this._scheduledDate;
  }

  public get maintenanceType(): string {
    return this._maintenanceType;
  }

  public get description(): string | null {
    return this._description;
  }

  public get status(): string {
    return this._status;
  }

  public get performedBy(): string | null {
    return this._performedBy;
  }

  public get completionDate(): Date | null {
    return this._completionDate;
  }

  public get cost(): number {
    return this._cost;
  }

  // --- Business Methods ---
  public complete(
    completionDate: Date,
    cost: number,
    performedBy: string,
  ): void {
    if (this._status === 'COMPLETED') {
      throw new BusinessRuleViolationException(
        'MAINTENANCE_ALREADY_COMPLETED',
        'This maintenance is already finished.',
      );
    }
    this._status = 'COMPLETED';
    this._completionDate = completionDate;
    this._cost = cost;
    this._performedBy = performedBy;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    assetId: string,
    organizationId: string,
    scheduledDate: Date,
  ): MaintenanceScheduleBuilder {
    return new MaintenanceScheduleBuilder(
      id,
      assetId,
      organizationId,
      scheduledDate,
    );
  }

  public static createFromBuilder(
    builder: MaintenanceScheduleBuilder,
  ): MaintenanceSchedule {
    return new MaintenanceSchedule(builder);
  }
}

export class MaintenanceScheduleBuilder {
  public readonly id: string;
  public readonly assetId: string;
  public readonly organizationId: string;
  public scheduledDate: Date;
  public maintenanceType: string = 'ROUTINE';
  public description: string | null = null;
  public status: string = 'SCHEDULED';
  public performedBy: string | null = null;
  public completionDate: Date | null = null;
  public cost: number = 0;

  constructor(
    id: string,
    assetId: string,
    organizationId: string,
    scheduledDate: Date,
  ) {
    this.id = id;
    this.assetId = assetId;
    this.organizationId = organizationId;
    this.scheduledDate = scheduledDate;
  }

  public withType(type: string): this {
    this.maintenanceType = type;
    return this;
  }

  public withDescription(description: string): this {
    this.description = description;
    return this;
  }

  public build(): MaintenanceSchedule {
    this.validate();
    return MaintenanceSchedule.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id || !this.assetId || !this.organizationId) {
      throw new BusinessRuleViolationException(
        'MAINTENANCE_REQUIRED_IDS',
        'Missing mandatory maintenance identifiers.',
      );
    }
  }
}
