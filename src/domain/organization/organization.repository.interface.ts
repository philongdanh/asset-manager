import { Organization } from './organization.entity';

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

export interface IOrgRepository {
  find(): Promise<Organization[]>;
  findById(organizationId: string): Promise<Organization | null>;
  save(org: Organization): Promise<Organization>;
}
