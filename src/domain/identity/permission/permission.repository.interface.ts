import { Permission } from './permission.entity';

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

export interface IPermissionRepository {
  find(): Promise<Permission[]>;

  findByIds(ids: string[]): Promise<Permission[]>;

  findById(id: string): Promise<Permission | null>;

  findByName(name: string): Promise<Permission | null>;

  save(permission: Permission): Promise<Permission>;
}
