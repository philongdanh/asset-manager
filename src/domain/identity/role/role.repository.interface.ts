import { Role } from './role.entity';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  // --- Query Methods ---

  findById(roleId: string): Promise<Role | null>;

  findByName(organizationId: string, roleName: string): Promise<Role | null>;

  findAll(
    organizationId: string,
    options?: {
      search?: string;
      systemOnly?: boolean;
      defaultOnly?: boolean;
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
    },
  ): Promise<{ data: Role[]; total: number }>;

  findByUserId(userId: string): Promise<Role[]>;

  findByOrganization(organizationId: string): Promise<Role[]>;

  findByPermission(permissionId: string): Promise<Role[]>;

  // --- Validation Methods ---

  existsByName(organizationId: string, roleName: string): Promise<boolean>;

  existsById(roleId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(role: Role): Promise<Role>;

  update(role: Role): Promise<Role>;

  saveMany(roles: Role[]): Promise<void>;

  delete(roleId: string): Promise<void>; // Soft delete

  deleteMany(roleIds: string[]): Promise<void>; // Soft delete

  hardDelete(roleId: string): Promise<void>;

  hardDeleteMany(roleIds: string[]): Promise<void>;

  restore(roleId: string): Promise<void>;

  restoreMany(roleIds: string[]): Promise<void>;

  // --- Role-Permission Management ---

  assignPermission(roleId: string, permissionId: string): Promise<void>;

  assignPermissions(roleId: string, permissionIds: string[]): Promise<void>;

  removePermission(roleId: string, permissionId: string): Promise<void>;

  removePermissions(roleId: string, permissionIds: string[]): Promise<void>;

  updatePermissions(roleId: string, permissionIds: string[]): Promise<void>;

  getRolePermissions(roleId: string): Promise<string[]>; // Returns permission IDs

  hasPermission(roleId: string, permissionId: string): Promise<boolean>;

  // --- User-Role Management ---

  assignToUser(roleId: string, userId: string): Promise<void>;

  assignToUsers(roleId: string, userIds: string[]): Promise<void>;

  removeFromUser(roleId: string, userId: string): Promise<void>;

  removeFromUsers(roleId: string, userIds: string[]): Promise<void>;

  // --- Special Methods ---

  getRolesSummary(organizationId: string): Promise<{
    totalCount: number;
    systemRolesCount: number;
    defaultRolesCount: number;
    customRolesCount: number;
    byUserCount: Record<string, number>; // roleId -> user count
  }>;

  findRolesByPermissionName(permissionName: string): Promise<Role[]>;

  findDefaultRoles(): Promise<Role[]>;

  findSystemRoles(): Promise<Role[]>;

  findRolesWithUserCount(organizationId: string): Promise<
    Array<{
      role: Role;
      userCount: number;
    }>
  >;
}
