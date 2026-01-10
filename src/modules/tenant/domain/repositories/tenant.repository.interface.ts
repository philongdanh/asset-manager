import { Tenant, TenantStatus } from '../entities/tenant.entity';

export const TENANT_REPOSITORY = Symbol('TENANT_REPOSITORY');

export interface ITenantRepository {
  // --- Query Methods ---
  find(
    status?: TenantStatus,
    includeDeleted?: boolean,
  ): Promise<{
    total: number;
    data: Tenant[];
  }>;
  findById(tenantId: string): Promise<Tenant | null>;

  // --- Validation Methods ---
  existsById(tenantId: string): Promise<boolean>;

  // --- Persistence Methods ---
  save(tenant: Tenant): Promise<Tenant>;
  delete(tenantIds: string[]): Promise<void>; // hard delete
}
