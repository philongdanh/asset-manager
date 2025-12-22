import { Organization } from './organization.entity';

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

export interface IOrganizationRepository {
  // --- Query Methods ---

  findById(id: string): Promise<Organization | null>;

  findByCode(code: string): Promise<Organization | null>;

  findAll(options?: {
    status?: string; // e.g., 'ACTIVE', 'INACTIVE', 'SUSPENDED'
    limit?: number;
    offset?: number;
  }): Promise<{ data: Organization[]; total: number }>;

  findByTaxCode(taxCode: string): Promise<Organization | null>;

  // --- Validation Methods ---

  existsByCode(code: string): Promise<boolean>;

  isActive(id: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(organization: Organization): Promise<Organization>;

  deactivate(id: string): Promise<void>;
}
