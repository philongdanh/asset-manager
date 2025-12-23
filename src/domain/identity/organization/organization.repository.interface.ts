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
    search?: string;
    includeDeleted?: boolean;
  }): Promise<{ data: Organization[]; total: number }>;

  findByTaxCode(taxCode: string): Promise<Organization | null>;

  findByEmail(email: string): Promise<Organization | null>;

  // --- Validation Methods ---

  existsByCode(code: string): Promise<boolean>;

  existsByTaxCode(taxCode: string): Promise<boolean>;

  existsByEmail(email: string): Promise<boolean>;

  isActive(id: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(organization: Organization): Promise<Organization>;

  update(organization: Organization): Promise<Organization>;

  saveMany(organizations: Organization[]): Promise<void>;

  // Delete methods (soft delete by default)
  delete(id: string): Promise<void>;

  deleteMany(ids: string[]): Promise<void>;

  // Hard delete methods
  hardDelete(id: string): Promise<void>;

  hardDeleteMany(ids: string[]): Promise<void>;

  // Restore methods
  restore(id: string): Promise<void>;

  restoreMany(ids: string[]): Promise<void>;
}
