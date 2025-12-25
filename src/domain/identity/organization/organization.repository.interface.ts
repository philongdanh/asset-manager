import { Organization, OrganizationStatus } from './organization.entity';

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

export interface IOrganizationRepository {
  // --- Query Methods ---

  find(options?: {
    status?: OrganizationStatus;
    includeDeleted?: boolean;
  }): Promise<{ data: Organization[]; total: number }>;

  findById(organizationId: string): Promise<Organization | null>;

  findByTaxCode(taxCode: string): Promise<Organization | null>;

  // --- Validation Methods ---

  existsByTaxCode(taxCode: string): Promise<boolean>;

  existsById(organizationId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(organization: Organization): Promise<Organization>;

  delete(organizationIds: string[]): Promise<void>; // Soft delete

  hardDelete(organizationIds: string[]): Promise<void>;

  restore(organizationIds: string[]): Promise<void>;
}
