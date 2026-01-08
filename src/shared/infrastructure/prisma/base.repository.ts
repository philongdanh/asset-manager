import { TenantContextService } from '../context/tenant-context.service';

export abstract class BaseRepository {
  constructor(protected readonly tenantContext: TenantContextService) {}

  /**
   * Returns a Prisma filter object that includes the organizationId if applicable.
   */
  protected getTenantFilter(): { organizationId: string } | {} {
    const tenantId = this.tenantContext.getTenantId();
    const isRoot = this.tenantContext.getIsRoot();

    // If it's a root user and no specific tenant is set, we don't filter.
    if (isRoot && !tenantId) {
      return {};
    }

    return tenantId ? { organizationId: tenantId } : {};
  }

  /**
   * Applies the tenant filter to a where clause.
   */
  protected applyTenantFilter<T>(where: T): T & { organizationId?: string } {
    return {
      ...where,
      ...this.getTenantFilter(),
    };
  }
}
