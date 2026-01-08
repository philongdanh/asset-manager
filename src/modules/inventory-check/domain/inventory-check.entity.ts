import { BaseEntity, BusinessRuleViolationException } from 'src/shared/domain';

export class InventoryCheck extends BaseEntity {
  private _organizationId: string;
  private _checkDate: Date;
  private _checkerUserId: string;
  private _status: string;
  private _inventoryName: string;
  private _notes?: string;

  protected constructor(builder: InventoryCheckBuilder) {
    super(builder.id, builder.createdAt, builder.updatedAt);
    this._organizationId = builder.organizationId;
    this._checkDate = builder.checkDate;
    this._checkerUserId = builder.checkerUserId;
    this._status = builder.status;
    this._inventoryName = builder.inventoryName;
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

  public get inventoryName(): string {
    return this._inventoryName;
  }

  public get notes(): string | undefined {
    return this._notes;
  }

  // --- Business Methods ---
  public finish(): void {
    this._status = 'FINISHED';
    this.markAsUpdated();
  }

  public updateInfo(inventoryName?: string, checkDate?: Date, notes?: string): void {
    if (inventoryName !== undefined) this._inventoryName = inventoryName;
    if (checkDate !== undefined) this._checkDate = checkDate;
    if (notes !== undefined) this._notes = notes;
    this.markAsUpdated();
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
  public inventoryName: string = '';
  public notes?: string;
  public createdAt: Date = new Date();
  public updatedAt: Date = new Date();

  constructor(id: string, organizationId: string, checkerUserId: string) {
    this.id = id;
    this.organizationId = organizationId;
    this.checkerUserId = checkerUserId;
  }

  public withInventoryName(name: string): this {
    this.inventoryName = name;
    return this;
  }

  public withNotes(notes: string): this {
    this.notes = notes;
    return this;
  }

  public withStatus(status: string): this {
    this.status = status;
    return this;
  }

  public withCheckDate(date: Date): this {
    this.checkDate = date;
    return this;
  }

  public withTimestamps(createdAt: Date, updatedAt: Date): this {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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
