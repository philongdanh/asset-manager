import { Role } from './role.entity';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  // --- Query Methods ---

  findById(id: string): Promise<Role | null>;

  findByCode(organizationId: string, code: string): Promise<Role | null>;

  findAll(
    organizationId: string,
    options?: {
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: Role[]; total: number }>;

  findByUserId(userId: string): Promise<Role[]>;

  // --- Validation Methods ---

  existsByCode(organizationId: string, code: string): Promise<boolean>;

  isInUse(id: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(role: Role): Promise<Role>;

  delete(id: string): Promise<void>;

  updatePermissions(roleId: string, permissionIds: string[]): Promise<void>;
}
