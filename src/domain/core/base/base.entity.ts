export abstract class BaseEntity {
  protected readonly _id: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _deletedAt?: Date | null;

  private _domainEvents: any[] = [];

  constructor(
    id: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this._id = id;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
    this._deletedAt = deletedAt || null;
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt || null;
  }

  public equals(other?: BaseEntity): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (this === other) {
      return true;
    }

    return this._id === other._id;
  }

  // ========== Timestamp Methods ===========

  protected markAsUpdated(): void {
    this._updatedAt = new Date();
  }

  protected markAsDeleted(): void {
    this._deletedAt = new Date();
    this.markAsUpdated();
  }

  protected restore(): void {
    this._deletedAt = null;
    this.markAsUpdated();
  }

  // ========== Domain Events Helpers (Optional) ===========

  get domainEvents(): any[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
    return [...this._domainEvents];
  }

  protected addDomainEvent(event: any): void {
    this._domainEvents.push(event);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
