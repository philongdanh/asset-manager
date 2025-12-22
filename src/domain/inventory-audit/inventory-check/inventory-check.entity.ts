import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class InventoryCheck extends BaseEntity {
  private _organizationId: string;
  private _checkDate: Date;
  private _checkerUserId: string;
  private _status: string;
  private _notes: string | null;

  protected constructor(builder: InventoryCheckBuilder) {
    super(builder.id);
    this._organizationId = builder.organizationId;
    this._checkDate = builder.checkDate;
    this._checkerUserId = builder.checkerUserId;
    this._status = builder.status;
    this._notes = builder.notes;
  }

  // --- Getters ---
  public get organizationId(): string {
    return this._organizationId;
  }

  public get checkDate(): Date {
    return this._checkDate;
  }

  public get checkerUserId(): string {
    return this._checkerUserId;
  }

  public get status(): string {
    return this._status;
  }

  public get notes(): string | null {
    return this._notes;
  }

  // --- Business Methods ---
  public finish(): void {
    this._status = 'FINISHED';
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    organizationId: string,
    checkerUserId: string,
  ): InventoryCheckBuilder {
    return new InventoryCheckBuilder(id, organizationId, checkerUserId);
  }

  public static createFromBuilder(
    builder: InventoryCheckBuilder,
  ): InventoryCheck {
    return new InventoryCheck(builder);
  }
}

export class InventoryCheckBuilder {
  public readonly id: string;
  public readonly organizationId: string;
  public readonly checkerUserId: string;
  public checkDate: Date = new Date();
  public status: string = 'IN_PROGRESS';
  public notes: string | null = null;

  constructor(id: string, organizationId: string, checkerUserId: string) {
    this.id = id;
    this.organizationId = organizationId;
    this.checkerUserId = checkerUserId;
  }

  public withNotes(notes: string): this {
    this.notes = notes;
    return this;
  }

  public build(): InventoryCheck {
    this.validate();
    return InventoryCheck.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id || !this.organizationId || !this.checkerUserId) {
      throw new BusinessRuleViolationException(
        'INVENTORY_CHECK_REQUIRED_FIELDS',
        'Missing mandatory inventory check fields.',
      );
    }
  }
}
