import { BaseEntity, BusinessRuleViolationException } from 'src/domain/core';

export class InventoryDetail extends BaseEntity {
  private _inventoryCheckId: string;
  private _assetId: string;
  private _expectedLocation: string | null;
  private _actualLocation: string | null;
  private _expectedStatus: string;
  private _actualStatus: string | null;
  private _isMatch: boolean;
  private _notes: string | null;

  protected constructor(builder: InventoryDetailBuilder) {
    super(builder.id);
    this._inventoryCheckId = builder.inventoryCheckId;
    this._assetId = builder.assetId;
    this._expectedLocation = builder.expectedLocation;
    this._actualLocation = builder.actualLocation;
    this._expectedStatus = builder.expectedStatus;
    this._actualStatus = builder.actualStatus;
    this._isMatch = builder.isMatch;
    this._notes = builder.notes;
  }

  // --- Getters ---
  public get inventoryCheckId(): string {
    return this._inventoryCheckId;
  }

  public get assetId(): string {
    return this._assetId;
  }

  public get expectedLocation(): string | null {
    return this._expectedLocation;
  }

  public get actualLocation(): string | null {
    return this._actualLocation;
  }

  public get expectedStatus(): string {
    return this._expectedStatus;
  }

  public get actualStatus(): string | null {
    return this._actualStatus;
  }

  public get isMatch(): boolean {
    return this._isMatch;
  }

  public get notes(): string | null {
    return this._notes;
  }

  // --- Business Methods ---
  public recordResult(
    actualLocation: string | null,
    actualStatus: string | null,
  ): void {
    this._actualLocation = actualLocation;
    this._actualStatus = actualStatus;

    this._isMatch =
      this._expectedLocation === this._actualLocation &&
      this._expectedStatus === this._actualStatus;
  }

  public addNote(note: string): void {
    this._notes = note;
  }

  // --- Static Builder Access ---
  public static builder(
    id: string,
    inventoryCheckId: string,
    assetId: string,
    expectedStatus: string,
  ): InventoryDetailBuilder {
    return new InventoryDetailBuilder(
      id,
      inventoryCheckId,
      assetId,
      expectedStatus,
    );
  }

  public static createFromBuilder(
    builder: InventoryDetailBuilder,
  ): InventoryDetail {
    return new InventoryDetail(builder);
  }
}

export class InventoryDetailBuilder {
  public readonly id: string;
  public readonly inventoryCheckId: string;
  public readonly assetId: string;
  public expectedLocation: string | null = null;
  public actualLocation: string | null = null;
  public expectedStatus: string;
  public actualStatus: string | null = null;
  public isMatch: boolean = false;
  public notes: string | null = null;

  constructor(
    id: string,
    inventoryCheckId: string,
    assetId: string,
    expectedStatus: string,
  ) {
    this.id = id;
    this.inventoryCheckId = inventoryCheckId;
    this.assetId = assetId;
    this.expectedStatus = expectedStatus;
  }

  public withExpectedLocation(location: string | null): this {
    this.expectedLocation = location;
    return this;
  }

  public withActualResult(
    location: string | null,
    status: string | null,
  ): this {
    this.actualLocation = location;
    this.actualStatus = status;
    this.isMatch =
      this.expectedLocation === location && this.expectedStatus === status;
    return this;
  }

  public withNotes(notes: string | null): this {
    this.notes = notes;
    return this;
  }

  public build(): InventoryDetail {
    this.validate();
    return InventoryDetail.createFromBuilder(this);
  }

  private validate(): void {
    if (!this.id || !this.inventoryCheckId || !this.assetId) {
      throw new BusinessRuleViolationException(
        'INVENTORY_DETAIL_REQUIRED_IDS',
        'ID, Inventory Check ID, and Asset ID are mandatory.',
      );
    }
  }
}
