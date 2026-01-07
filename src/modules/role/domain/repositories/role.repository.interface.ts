import { Role } from '../entities/role.entity';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  // --- Query Methods ---
  find(organizationId: string): Promise<{ data: Role[]; total: number }>;
  findById(roleId: string, organizationId?: string): Promise<Role | null>;
  findByUserId(userId: string): Promise<Role[]>;
  findByPermission(permissionId: string): Promise<Role[]>;

  // --- Validation Methods ---
  existsById(roleId: string): Promise<boolean>;

  // --- Persistence Methods ---
  save(role: Role): Promise<Role>;
  delete(roleIds: string[]): Promise<void>;

  // --- Role-Permission Management ---
  getRolePermissions(roleId: string): Promise<string[]>;
  hasPermission(roleId: string, permissionId: string): Promise<boolean>;
  assignPermissions(roleId: string, permissionIds: string[]): Promise<void>;
  removePermissions(roleId: string, permissionIds: string[]): Promise<void>;

  // --- User-Role Management ---
  assignToUsers(roleId: string, userIds: string[]): Promise<void>;
  removeFromUsers(roleId: string, userIds: string[]): Promise<void>;
}
