import { Permission } from '../entities/permission.entity';

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

export interface IPermissionRepository {
  // --- Query Methods ---
  find(): Promise<Permission[]>;
  findById(id: string): Promise<Permission | null>;
  findByRoles(roleIds: string[]): Promise<Permission[]>;

  // --- Validation Methods ---
  existsById(id: string): Promise<boolean>;

  // --- Persistence Methods ---
  save(permission: Permission): Promise<Permission>;
  delete(ids: string[]): Promise<void>;
}
