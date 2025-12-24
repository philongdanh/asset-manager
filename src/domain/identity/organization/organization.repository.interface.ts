import { Organization, OrganizationStatus } from './organization.entity';

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

export interface IOrganizationRepository {
  // --- Query Methods ---

  findById(organizationId: string): Promise<Organization | null>;

  findByCode(code: string): Promise<Organization | null>;

  findAll(options?: {
    status?: OrganizationStatus;
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

  existsById(organizationId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(organization: Organization): Promise<Organization>;

  update(organization: Organization): Promise<Organization>;

  saveMany(organizations: Organization[]): Promise<void>;

  delete(organizationId: string): Promise<void>; // Soft delete

  deleteMany(organizationIds: string[]): Promise<void>; // Soft delete

  hardDelete(organizationId: string): Promise<void>;

  hardDeleteMany(organizationIds: string[]): Promise<void>;

  restore(organizationId: string): Promise<void>;

  restoreMany(organizationIds: string[]): Promise<void>;

  // --- Special Methods ---

  getOrganizationsSummary(): Promise<{
    totalCount: number;
    activeCount: number;
    inactiveCount: number;
    suspendedCount: number;
    deletedCount: number;
  }>;

  findOrganizationsWithStatus(
    status: OrganizationStatus,
  ): Promise<Organization[]>;

  findRecentlyCreated(days: number): Promise<Organization[]>;
}
