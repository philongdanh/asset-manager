import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  EMERGENCY = 'EMERGENCY',
  ROUTINE = 'ROUTINE',
  SCHEDULED = 'SCHEDULED',
  UNSCHEDULED = 'UNSCHEDULED',
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class MaintenanceSchedule extends BaseEntity {
  private _assetId: string;
  private _organizationId: string;
  private _maintenanceType: MaintenanceType;
  private _scheduledDate: Date;
  private _actualDate: Date | null;
  private _status: MaintenanceStatus;
  private _description: string | null;
  private _estimatedCost: number | null;
  private _actualCost: number | null;
  private _performedByUserId: string | null;
  private _result: string | null;

  protected constructor(builder: MaintenanceScheduleBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt, builder.deletedAt);
    this._assetId = builder.assetId;
    this._organizationId = builder.organizationId;
    this._maintenanceType = builder.maintenanceType;
    this._scheduledDate = builder.scheduledDate;
    this._actualDate = builder.actualDate;
    this._status = builder.status;
    this._description = builder.description;
    this._estimatedCost = builder.estimatedCost;
    this._actualCost = builder.actualCost;
    this._performedByUserId = builder.performedByUserId;
    this._result = builder.result;
  }

  // --- Getters ---
  public get assetId(): string {
    return this._assetId;
  }

  public get organizationId(): string {
    return this._organizationId;
  }

  public get maintenanceType(): MaintenanceType {
    return this._maintenanceType;
  }

  public get scheduledDate(): Date {
    return this._scheduledDate;
  }

  public get actualDate(): Date | null {
    return this._actualDate;
  }

  public get status(): MaintenanceStatus {
    return this._status;
  }

  public get description(): string | null {
    return this._description;
  }

  public get estimatedCost(): number | null {
    return this._estimatedCost;
  }

  public get actualCost(): number | null {
    return this._actualCost;
  }

  public get performedByUserId(): string | null {
    return this._performedByUserId;
  }

  public get result(): string | null {
    return this._result;
  }

  // --- Business Methods ---
  public schedule(
    maintenanceType: MaintenanceType,
    scheduledDate: Date,
    description?: string | null,
    estimatedCost?: number | null,
  ): void {
    this._maintenanceType = maintenanceType;
    this._scheduledDate = scheduledDate;
    this._description = description || null;
    this._estimatedCost = estimatedCost || null;
    this._status = MaintenanceStatus.SCHEDULED;
    this.markAsUpdated();
  }

  public startMaintenance(performedByUserId: string): void {
    if (
      this._status !== MaintenanceStatus.SCHEDULED &&
      this._status !== MaintenanceStatus.APPROVED
    ) {
      throw new BusinessRuleViolationException(
        'INVALID_STATUS_TRANSITION',
        'Maintenance can only be started from SCHEDULED or APPROVED status.',
      );
    }
    this._status = MaintenanceStatus.IN_PROGRESS;
    this._performedByUserId = performedByUserId;
    this._actualDate = new Date();
    this.markAsUpdated();
  }

  public complete(
    result: string,
    actualCost: number | null,
    completionDate?: Date,
  ): void {
    if (this._status !== MaintenanceStatus.IN_PROGRESS) {
      throw new BusinessRuleViolationException(
        'CANNOT_COMPLETE',
        'Only maintenance in progress can be completed.',
      );
    }
    if (actualCost !== null && actualCost < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_COST',
        'Actual cost cannot be negative.',
      );
    }

    this._status = MaintenanceStatus.COMPLETED;
    this._result = result;
    this._actualCost = actualCost;
    this._actualDate = completionDate || new Date();
    this.markAsUpdated();
  }

  public cancel(reason: string): void {
    if (
      this._status === MaintenanceStatus.COMPLETED ||
      this._status === MaintenanceStatus.CANCELLED
    ) {
      throw new BusinessRuleViolationException(
        'CANNOT_CANCEL',
        'Cannot cancel completed or already cancelled maintenance.',
      );
    }

    this._status = MaintenanceStatus.CANCELLED;
    this._result = reason;
    this.markAsUpdated();
  }

  public approve(): void {
    if (this._status !== MaintenanceStatus.PENDING_APPROVAL) {
      throw new BusinessRuleViolationException(
        'CANNOT_APPROVE',
        'Only maintenance pending approval can be approved.',
      );
    }
    this._status = MaintenanceStatus.APPROVED;
    this.markAsUpdated();
  }

  public reject(reason: string): void {
    if (this._status !== MaintenanceStatus.PENDING_APPROVAL) {
      throw new BusinessRuleViolationException(
        'CANNOT_REJECT',
        'Only maintenance pending approval can be rejected.',
      );
    }
    this._status = MaintenanceStatus.REJECTED;
    this._result = reason;
    this.markAsUpdated();
  }

  public reschedule(newDate: Date): void {
    if (
      this._status !== MaintenanceStatus.SCHEDULED &&
      this._status !== MaintenanceStatus.APPROVED
    ) {
      throw new BusinessRuleViolationException(
        'CANNOT_RESCHEDULE',
        'Only scheduled or approved maintenance can be rescheduled.',
      );
    }
    if (newDate < new Date()) {
      throw new BusinessRuleViolationException(
        'INVALID_DATE',
        'New scheduled date cannot be in the past.',
      );
    }
    this._scheduledDate = newDate;
    this.markAsUpdated();
  }

  public updateEstimate(newEstimatedCost: number | null): void {
    if (newEstimatedCost !== null && newEstimatedCost < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_ESTIMATE',
        'Estimated cost cannot be negative.',
      );
    }
    this._estimatedCost = newEstimatedCost;
    this.markAsUpdated();
  }

  // --- Helper Methods ---
  public isOverdue(): boolean {
    return this._status === MaintenanceStatus.OVERDUE;
  }

  public isScheduled(): boolean {
    return this._status === MaintenanceStatus.SCHEDULED;
  }

  public isInProgress(): boolean {
    return this._status === MaintenanceStatus.IN_PROGRESS;
  }

  public isCompleted(): boolean {
    return this._status === MaintenanceStatus.COMPLETED;
  }

  public isCancelled(): boolean {
    return this._status === MaintenanceStatus.CANCELLED;
  }

  public isPreventive(): boolean {
    return this._maintenanceType === MaintenanceType.PREVENTIVE;
  }

  public isCorrective(): boolean {
    return this._maintenanceType === MaintenanceType.CORRECTIVE;
  }

  public isEmergency(): boolean {
    return this._maintenanceType === MaintenanceType.EMERGENCY;
  }

  public getDaysOverdue(): number {
    if (
      this._status !== MaintenanceStatus.OVERDUE ||
      this._scheduledDate >= new Date()
    ) {
      return 0;
    }
    const today = new Date();
    const diffTime = today.getTime() - this._scheduledDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // --- Static Factory ---
  public static builder(
    id: string,
    assetId: string,
    organizationId: string,
    maintenanceType: MaintenanceType,
    scheduledDate: Date,
  ): MaintenanceScheduleBuilder {
    return new MaintenanceScheduleBuilder(
      id,
      assetId,
      organizationId,
      maintenanceType,
      scheduledDate,
    );
  }

  public static createFromBuilder(
    builder: MaintenanceScheduleBuilder,
  ): MaintenanceSchedule {
    return new MaintenanceSchedule(builder);
  }
}

// --- Builder Class ---
export class MaintenanceScheduleBuilder {
  public scheduledDate: Date;
  public actualDate: Date | null = null;
  public status: MaintenanceStatus = MaintenanceStatus.SCHEDULED;
  public description: string | null = null;
  public estimatedCost: number | null = null;
  public actualCost: number | null = null;
  public performedByUserId: string | null = null;
  public result: string | null = null;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  constructor(
    public readonly id: string,
    public readonly assetId: string,
    public readonly organizationId: string,
    public readonly maintenanceType: MaintenanceType,
    scheduledDate: Date,
  ) {
    this.scheduledDate = scheduledDate;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public withScheduledDate(scheduledDate: Date): this {
    this.scheduledDate = scheduledDate;
    return this;
  }

  public withActualDate(actualDate: Date | null): this {
    this.actualDate = actualDate;
    return this;
  }

  public withStatus(status: MaintenanceStatus): this {
    this.status = status;
    return this;
  }

  public withDescription(description: string | null): this {
    this.description = description;
    return this;
  }

  public withEstimatedCost(estimatedCost: number | null): this {
    this.estimatedCost = estimatedCost;
    return this;
  }

  public withActualCost(actualCost: number | null): this {
    this.actualCost = actualCost;
    return this;
  }

  public withPerformedByUserId(performedByUserId: string | null): this {
    this.performedByUserId = performedByUserId;
    return this;
  }

  public withResult(result: string | null): this {
    this.result = result;
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

  public build(): MaintenanceSchedule {
    if (!this.id) {
      throw new BusinessRuleViolationException(
        'MAINTENANCE_ID_REQUIRED',
        'ID is mandatory for maintenance schedule.',
      );
    }
    if (!this.assetId) {
      throw new BusinessRuleViolationException(
        'ASSET_ID_REQUIRED',
        'Asset ID is mandatory for maintenance schedule.',
      );
    }
    if (!this.organizationId) {
      throw new BusinessRuleViolationException(
        'ORGANIZATION_ID_REQUIRED',
        'Organization ID is mandatory for maintenance schedule.',
      );
    }
    if (!this.maintenanceType) {
      throw new BusinessRuleViolationException(
        'MAINTENANCE_TYPE_REQUIRED',
        'Maintenance type is mandatory.',
      );
    }
    if (!this.scheduledDate) {
      throw new BusinessRuleViolationException(
        'SCHEDULED_DATE_REQUIRED',
        'Scheduled date is mandatory.',
      );
    }
    if (this.scheduledDate < new Date()) {
      throw new BusinessRuleViolationException(
        'INVALID_SCHEDULED_DATE',
        'Scheduled date cannot be in the past.',
      );
    }
    if (this.estimatedCost !== null && this.estimatedCost < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_ESTIMATED_COST',
        'Estimated cost cannot be negative.',
      );
    }
    if (this.actualCost !== null && this.actualCost < 0) {
      throw new BusinessRuleViolationException(
        'INVALID_ACTUAL_COST',
        'Actual cost cannot be negative.',
      );
    }

    return MaintenanceSchedule.createFromBuilder(this);
  }
}
