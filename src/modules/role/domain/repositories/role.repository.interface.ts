import { Role } from '../entities/role.entity';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  // --- Query Methods ---
  find(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  findByUser(userId: string): Promise<Role[]>;
  findByPerms(permIds: string[]): Promise<Role[]>;

  // --- Persistence Methods ---
  save(role: Role): Promise<Role>;
  delete(ids: string[]): Promise<void>;

  // --- Role-Permission Management ---
  syncPerms(id: string, permIds: string[]): Promise<void>;

  // --- User-Role Management ---
  assignToUsers(roleId: string, userIds: string[]): Promise<void>;
  removeFromUsers(roleId: string, userIds: string[]): Promise<void>;
}
