import { Organization, OrganizationStatus } from '../entities/organization.entity';

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

export interface IOrganizationRepository {
    // --- Query Methods ---
    find(
        status?: OrganizationStatus,
        includeDeleted?: boolean,
    ): Promise<Organization[]>;
    findById(organizationId: string): Promise<Organization | null>;

    // --- Validation Methods ---
    existsById(organizationId: string): Promise<boolean>;

    // --- Persistence Methods ---
    save(organization: Organization): Promise<Organization>;
    delete(organizationIds: string[]): Promise<void>; // hard delete
}
