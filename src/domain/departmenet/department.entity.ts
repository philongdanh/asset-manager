export class Department {
  private _id: string;
  private _organizationId: string;
  private _name: string;
  private _parentId: string | null;

  constructor(
    id: string,
    organizationId: string,
    name: string,
    parentId: string | null,
  ) {
    this._id = id;
    this._organizationId = organizationId;
    this._name = name;
    this._parentId = parentId;
  }

  get id(): string {
    return this._id;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get name(): string {
    return this._organizationId;
  }

  get parentId(): string | null {
    return this._parentId;
  }

  public static create(
    id: string,
    organizationId: string,
    name: string,
    parentId: string | null,
  ): Department {
    return new Department(id, organizationId, name, parentId);
  }

  public updateInfo(
    name: string | undefined,
    organizationId: string | undefined,
    parentId: string | null | undefined,
  ): void {
    if (name !== undefined) {
      this._name = name;
    }
    if (organizationId !== undefined) {
      this._organizationId = organizationId;
    }
    if (parentId !== undefined) {
      this._parentId = parentId;
    }
  }
}
