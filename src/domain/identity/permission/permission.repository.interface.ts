import { Permission } from './permission.entity';

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

export interface IPermissionRepository {
  // --- Query Methods ---

  findById(id: string): Promise<Permission | null>;

  findByCode(code: string): Promise<Permission | null>;

  findAll(options?: {
    module?: string; // e.g., 'ASSET', 'INVENTORY', 'ACCOUNTING'
    limit?: number;
    offset?: number;
  }): Promise<{ data: Permission[]; total: number }>;

  findByRoleId(roleId: string): Promise<Permission[]>;

  findByModule(module: string): Promise<Permission[]>;

  // --- Validation Methods ---

  existsByCode(code: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(permission: Permission): Promise<Permission>;

  delete(id: string): Promise<void>;
}
