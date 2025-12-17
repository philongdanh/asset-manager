import { Asset } from '../asset';

export class Organization {
  private _id: string;
  private _name: string;
  private _status: OrganizationStatus;

  private _assets: Asset[] = [];

  constructor(
    id: string,
    name: string,
    status: OrganizationStatus = OrganizationStatus.ACTIVE,
    assets: Asset[] = [],
  ) {
    this._id = id;
    this._name = name;
    this._status = status;
    this._assets = assets;
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

  get assets(): Asset[] {
    return this._assets;
  }

  public static createNew(
    id: string,
    name: string,
    status: OrganizationStatus = OrganizationStatus.ACTIVE,
    assets: Asset[] = [],
  ): Organization {
    return new Organization(id, name, status, assets);
  }

  public updateInfo(newName: string, newStatus: OrganizationStatus): void {
    this._name = newName;
    this._status = newStatus;
  }

  public activate(): void {
    this._status = OrganizationStatus.ACTIVE;
  }

  public deactivate(): void {
    this._status = OrganizationStatus.INACTIVE;
  }
}

export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
