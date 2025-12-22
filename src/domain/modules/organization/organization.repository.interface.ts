import { Organization } from './organization.entity';

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

export interface IOrganizationRepository {
  find(): Promise<Organization[]>;

  findById(id: string): Promise<Organization | null>;

  save(org: Organization): Promise<Organization>;
}
