import { Permission } from './permission.entity';

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

export interface IPermissionRepository {
  // --- Query Methods ---

  findById(permissionId: string): Promise<Permission | null>;

  findByName(name: string): Promise<Permission | null>;

  findAll(options?: {
    search?: string;
    module?: string;
    systemOnly?: boolean;
    limit?: number;
    offset?: number;
    includeDeleted?: boolean;
  }): Promise<{ data: Permission[]; total: number }>;

  findByRoleId(roleId: string): Promise<Permission[]>;

  findByModule(module: string): Promise<Permission[]>;

  findByAction(module: string, action: string): Promise<Permission | null>;

  findSystemPermissions(): Promise<Permission[]>;

  // --- Validation Methods ---

  existsByName(name: string): Promise<boolean>;

  existsById(permissionId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(permission: Permission): Promise<Permission>;

  update(permission: Permission): Promise<Permission>;

  saveMany(permissions: Permission[]): Promise<void>;

  delete(permissionId: string): Promise<void>; // Soft delete

  deleteMany(permissionIds: string[]): Promise<void>; // Soft delete

  hardDelete(permissionId: string): Promise<void>;

  hardDeleteMany(permissionIds: string[]): Promise<void>;

  restore(permissionId: string): Promise<void>;

  restoreMany(permissionIds: string[]): Promise<void>;

  // --- Special Methods ---

  getPermissionsSummary(): Promise<{
    totalCount: number;
    byModule: Record<string, number>;
    systemPermissionsCount: number;
    customPermissionsCount: number;
  }>;

  findPermissionsByNames(names: string[]): Promise<Permission[]>;

  findPermissionsByPattern(pattern: string): Promise<Permission[]>;
}
