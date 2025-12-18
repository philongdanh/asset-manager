import { Organization } from './organization.entity';

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

export interface IOrganizationRepository {
  find(organizationId: string): Promise<Organization[]>;
  findById(organizationId: string): Promise<Organization | null>;
  updateInfo(organizationId: string, newName: string): Promise<void>;
  setStatus(organizationId: string, status: boolean): Promise<void>;
  save(org: Organization): Promise<Organization>;
}
