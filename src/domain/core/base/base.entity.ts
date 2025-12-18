export abstract class BaseEntity {
  protected readonly _id: string;

  private _domainEvents: any[] = [];

  constructor(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
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
