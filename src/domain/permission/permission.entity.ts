import { Role } from '../role/role.entity';

export class Permission {
  private _id: string;
  private _name: string;
  private _description: string;
  private _roles: Role[];

  constructor(
    id: string,
    name: string,
    description: string,
    roles: Role[] = [],
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._roles = roles;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get roles(): Role[] {
    return this._roles;
  }

  public static createNew(
    id: string,
    name: string,
    description: string,
    roles: Role[] = [],
  ): Permission {
    return new Permission(id, name, description, roles);
  }

  public updateInfo(name: string, description: string): void {
    this._name = name;
    this._description = description;
  }
}
