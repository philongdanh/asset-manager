import { Permission } from './permission.entity';

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

export interface IPermissionRepository {
  // --- Query Methods ---

  findById(permissionId: string): Promise<Permission | null>;

  find(): Promise<{ data: Permission[]; total: number }>;

  findByRole(roleId: string): Promise<Permission[]>;

  // --- Validation Methods ---

  existsById(permissionId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(permission: Permission): Promise<Permission>;

  delete(permissionIds: string[]): Promise<void>;
}
