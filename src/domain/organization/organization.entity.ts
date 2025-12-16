export class Organization {
  public id: string;
  public name: string;
  public status: 'ACTIVE' | 'INACTIVE';

  constructor(id: string, name: string, status: string) {
    this.id = id;
    this.name = name;
    if (status !== 'ACTIVE' && status !== 'INACTIVE') {
      throw new Error('Invalid status value.');
    }
    this.status = status;
  }

  public static createNew(
    id: string,
    name: string,
    status: 'ACTIVE' | 'INACTIVE' = 'ACTIVE',
  ): Organization {
    if (!name) {
      throw new Error('Organization name is required.');
    }
    return new Organization(id, name, status);
  }

  public static updateInfo(org: Organization, newName: string): void {
    if (!newName || newName.length < 3) {
      throw new Error('Organization name is too short.');
    }
    org.name = newName;
  }

  public static activate(org: Organization): void {
    org.status = 'ACTIVE';
  }

  public static deactivate(org: Organization): void {
    org.status = 'INACTIVE';
  }

  public static validateTenancy(
    org: Organization,
    expectedId: string,
  ): boolean {
    return org.id === expectedId;
  }
}
