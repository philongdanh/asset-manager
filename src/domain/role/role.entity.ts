import { Permission } from '../permission';

export class Role {
  private _id: string;
  private _organizationId: string;
  private _name: string;
  private _permissions: Permission[];

  constructor(
    id: string,
    organizationId: string,
    name: string,
    permissions: Permission[] = [],
  ) {
    this._id = id;
    this._organizationId = organizationId;
    this._name = name;
    this._permissions = permissions;
  }

  get id(): string {
    return this._id;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get name(): string {
    return this._name;
  }

  get permissions(): Permission[] {
    return this._permissions;
  }

  public static createNew(
    id: string,
    organizationId: string,
    name: string,
    permissions: Permission[] = [],
  ): Role {
    return new Role(id, organizationId, name, permissions);
  }

  public updateInfo(name: string): void {
    this._name = name;
  }

  public assignPermission(permission: Permission): void {
    if (!this.hasPermission(permission.id)) {
      this._permissions.push(permission);
    }
  }

  public removePermission(permissionId: string): void {
    this._permissions = this._permissions.filter((p) => p.id !== permissionId);
  }

  public hasPermission(permissionId: string): boolean {
    return this._permissions.some((p) => p.id === permissionId);
  }
}
