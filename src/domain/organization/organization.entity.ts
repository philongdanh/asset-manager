export class Organization {
  private _id: string;
  private _name: string;
  private _status: OrganizationStatus;

  constructor(id: string, name: string, status: OrganizationStatus) {
    this._id = id;
    this._name = name;
    this._status = status;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get status(): OrganizationStatus {
    return this._status;
  }

  public static createNew(
    id: string,
    name: string,
    status: OrganizationStatus | null,
  ): Organization {
    if (status === null) {
      status = OrganizationStatus.ACTIVE;
    }
    return new Organization(id, name, status);
  }

  public updateInfo(newName: string): void {
    this._name = newName;
  }

  public activate(): void {
    if (this._status === OrganizationStatus.ACTIVE) {
      return;
    }
    this._status = OrganizationStatus.ACTIVE;
  }

  public deactivate(): void {
    if (this._status === OrganizationStatus.INACTIVE) {
      return;
    }
    this._status = OrganizationStatus.INACTIVE;
  }

  public validateTenancy(org: Organization, expectedId: string): boolean {
    return org._id === expectedId;
  }
}

export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUPPENDED = 'SUSPENDED',
}
