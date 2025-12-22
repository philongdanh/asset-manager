import { Permission } from './permission.entity';

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

export interface IPermissionRepository {
  find(): Promise<Permission[]>;

  findByIds(permissionIds: string[]): Promise<Permission[]>;

  findById(permissionId: string): Promise<Permission | null>;

  findByName(permissionName: string): Promise<Permission | null>;

  save(permission: Permission): Promise<Permission>;
}
