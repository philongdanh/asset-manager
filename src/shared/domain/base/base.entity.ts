export abstract class BaseEntity {
  protected readonly _id: string;
  protected _createdAt?: Date;
  protected _updatedAt?: Date;
  protected _deletedAt?: Date | null;

  constructor(
    id: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this._id = id;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
    this._deletedAt = deletedAt;
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this._deletedAt;
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

  // ========== Timestamp Check Methods ===========

  public hasTimestamps(): boolean {
    return this._createdAt !== undefined && this._updatedAt !== undefined;
  }

  public hasSoftDelete(): boolean {
    return this._deletedAt !== undefined;
  }
}
