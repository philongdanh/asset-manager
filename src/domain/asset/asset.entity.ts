export class Asset {
  public id: string;
  public orgId: string;
  public name: string;
  public code: string;

  constructor(id: string, orgId: string, name: string, code: string) {
    this.id = id;
    this.orgId = orgId;
    this.name = name;
    this.code = code;
  }

  public static create(
    id: string,
    orgId: string,
    name: string,
    code: string,
  ): Asset {
    if (!name) {
      throw new Error('Asset name is required.');
    }
    return new Asset(id, orgId, name, code);
  }
}
